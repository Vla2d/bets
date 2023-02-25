1. Install deps.

2. Create .env file using .env.example file.
3. Go to [Telegram web page](https://my.telegram.org/apps) , log in and configure your app.
4. Fill in the ``apiId`` and ``apiHash`` fields.
5. Go to [Telegram web client](https://web.telegram.org/z/), and copy your channel id from the url line. E.g if the id is ``-1687256227``, we remove minus and copy just the ``1687256227``. Assign this id to ``bettingChannelId=``.
6. Run the application using ``node index.js`` and follow the log in instructions. Once you've successfully logged in and run the application, you will see a long ``stringSession`` string. Copy and paste it into the 4th field: ``stringSession``. When you've done that, you will no longer need to log in again.