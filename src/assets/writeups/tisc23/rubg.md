When I run the rubg-1.0.0.AppImage file, I am greeted with a welcome screen followed by a 16x16 grid. I clicked on one of the squares and immediately lost.

First, I tried to decompile it using ghidra, however I was unable to locate the app logic. After unsuccessfully looking through the code for a while, I came up with an idea - maybe each time I start a new game, it uses some random function from libc to generate the grid. So I wrote a library to overwrite some libc functions:

```c:fake.c
#include <stdlib.h>
#include <time.h>

int rand() {
    return 0;
}

time_t time(time_t *second) {
    return 0;
}
```

I compiled this with `gcc -shared -o fake.so -fPIC fake.c` and ran with `LD_PRELOAD=$PWD/fake.so ./rubg-1.0.0.AppImage`. However, the grid was still changing each time I started the app. Then I realised there were many possible other ways the app could be doing random number generation, such as `clock_gettime()` and possibly using their own random functions.

While I was testing the app, I saw a network unavailable screen for a split second and suddenly realised the app connects to the internet, and hence probably gets grid data from a server (I failed to consider this possibilty earlier probably because all rev/pwn challenges I had done before did not connect to the internet).

Hence, I opened wireshark and captured the http traffic coming from the app. I noticed the following request when the grid was generated:

```
GET /generate HTTP/1.1
Host: rubg.chals.tisc23.ctf.sg:34567
Connection: keep-alive
Accept: application/json, text/plain, */*
Accept-Encoding: gzip, deflate
Accept-Language: en-US
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) rubg/1.0.0 Chrome/112.0.5615.204 Electron/24.4.0 Safari/537.36


```

This returned json data:

```json
{
  "a": [0,0,0,2,2,2,2,126,26,0,2,0,0,0,0,0,4,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0],
  "b": "8337805696273711620",
  "c": "11909354959045574160",
  "d": 1473666718
}
```

These seem to encode the layout of the grid. To test this, I setup a local python server and redirected requests to it:

```python:server.py
from flask import Flask, request

app = Flask(__name__)

@app.get('/')
def test():
    return 'pong'

@app.get('/generate')
def gen():
    return {"a":[0,0,0,2,2,2,2,126,26,0,2,0,0,0,0,0,4,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0],"b":"8337805696273711620","c":"11909354959045574160","d":1473666718}

app.run(port=34567)
```

```plaintext:/etc/hosts
...
127.0.0.1	rubg.chals.tisc23.ctf.sg
```

Now when I run the app, the ships are always placed in the same squares. I found their positions through brute force and got a victory screen.

![rubg grid](/rubg-grid.png)

![rubg victory](/rubg-victory.png)

However, I still didn't get the flag. Looking back at the chal description, I learned that a "flawless victory" is needed to get the flag. I returned to analysing the binary to find out what this might be, and this time, after taking a closer look at the `strings` output, I realised this might be an electron binary.

Thus, I extract the files from the appimage using `rubg-1.0.0.AppImage --appimage-extract`, resulting in a squashfs-root folder. Then I run `asar extract squashfs-root/resources/app.asar decomp`, which produced the following directory:

![rubg decompiled folder](/rubg-electron-decomp.png)

The main logic is in `dist/assets/index-c08c228b.js`. After a while, I found the following function:

```javascript
async function m(x) {
  if (d(x)) {
    if (
      ((t.value[Math.floor(x / 16)] ^= 1 << x % 16),
      (l.value[x] = 1),
      new Audio(Ku).play(),
      c.value.push(
        `${n.value.toString(16).padStart(16, '0')[15 - (x % 16)]}${
          r.value.toString(16).padStart(16, '0')[Math.floor(x / 16)]
        }`
      ),
      t.value.every((_) => _ === 0))
    )
      if (JSON.stringify(c.value) === JSON.stringify([...c.value].sort())) {
        const _ = { a: [...c.value].sort().join(''), b: s.value };
        (i.value = 101), (o.value = (await $u(_)).flag), new Audio(_s).play(), (i.value = 4);
      } else (i.value = 3), new Audio(_s).play();
  } else (i.value = 2), new Audio(qu).play();
}
```