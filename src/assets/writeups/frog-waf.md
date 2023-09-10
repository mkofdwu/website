This challenge is SSTI with Java expression language, the main difficulty is the filter bypass.

# overview

The app is just a simple form where you submit name, contact number, country etc and validation is performed on the input.

# foothold

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

Back to the code, here is the filter in FrogWAF.java

```java
```

I ran the project locally (the authors were kind enough to provide the full docker configuration so I only had to run `docker build -t frogwaf` and `docker run -t frogwaf`), I removed the filter

And I resubmitted the payload. Here is the result:

<Image>

Now, I was confident that the challenge is SSTI bypass.

# exploit

I looked up java SSTI in HackTricks. From this article <link>, I learned that I needed to run `T(java.lang.Runtime).<etc>`. Looking at the frogwaf filter, I needed a few things first.

1. a class
2. arbitrary number
3. arbitrary string

# getting a class

We begin by getting access to a class. After testing various payloads, I found that `${[].getClass()}` successfully returned `<class java.lang.ArrayList>`. Furthermore, `${[].toString()}` gives us access to a string. I looked up the list of string methods

getMethods()
forName()

IOUtils.

Found Spring

Overall, this challenge, though very tedious, was mostly straightforward. The main difficulty came from the bugs I encountered along the way