I initially attempted this challenge because the code was short and it seemed simple, but in the end it took me two days to solve.

```python:jail.py
#/usr/bin/python3
# nowadays, setattr jails seem to be all the hype, and everyone loves builtins, so enjoy a setattr jail with builtins :>
for _ in range(2):
    src = input("Src: ")
    dst = input("Dst: ")
    assert "." not in src and dst.count(".") < 3
    for x in dst.split("."):
        assert x not in ["setattr", "getattr", "print"], "Hey im using those!" 
    a = "." in dst
    b = dst.split(".")
    x = dst
    pdist = __builtins__
    dst = getattr(__builtins__, dst.split(".")[0])
    if a:
        for x in b[1:]:
            pdist = dst
            dst = getattr(dst, x)
    src = getattr(__builtins__, src)
    setattr(pdist, x, src)

print(__builtins__)
```

After examining this code for a while, my first thought was to do something like `getattr = exec` using the first setattr call, however the blacklist prevents me from doing so.

Then, I considered using errors to trigger exec: using `setattr(__builtins__, "AttributeError", exec)` in the first call, then sending something like `print(next(open("flag")))` as dst after that. However, this never worked and `'__new_member__'` was being passed to exec instead. I am still not sure why this happened, as when I did `setattr(__builtins__, "AttributeError", print)`, the expected command was printed out.

I was stuck here for a while until I considered overriding the __getattr__ or __setattr__ dunder methods on an object. I tried setting it on a random function: `print.__getattr__ = exec`. This gave the error 

After a while, I had the idea of fuzzing all the properties I could call setattr on, hence I wrote a quick python script to list all of them.

To my surprise, there was an instance of a class - ModuleSpec - available, and it's class had the __getattribute__ property available to override.

Honestly, this was one of the hardest ctf challenges I've solved thus far, and I have learned quite a bit from it.