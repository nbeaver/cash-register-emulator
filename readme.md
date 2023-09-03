This is an emulator for a Royal model Alpha 601SC cash register
that I wrote between October 2010 and September 2011
for training purposes.
You can try it here:

<https://nbeaver.github.io/cash-register-emulator/>

At the time I was an undergraduate student at [Gustavus Adolphus College](https://gustavus.edu/)
and my campus employment was at Media Services.
Training on the cash register was difficult
because it was not often used but necessary
for e.g. students who wanted to pay for passport photos
or large-format printing with cash.
Messing up a transaction resulted in an annoying error tone
and also meant that the auditing log would become more complicated.
To help with this, I wrote the emulator
so dry-run training could be demonstrated on a web browser.
No attempt was made to make the emulation exhaustive,
only enough to do basic transactions and recover from common errors.
Employee names have been redacted
but otherwise the code is unchanged.

I am happy to say that the error noise is fairly authentic.
I recorded the cash register with a video camera
and then used Audacity to look for spectral peaks
and generate a tone at about 5182 Hz,
a high whining frequency that sounds something like
a continuous smoke detector alarm or a very persistent mosquito.

The year I graduated, [Media Services was transitioned to Event Services and its other functions moved to other departments](https://mediaservices.blog.gustavus.edu/2014/07/22/so-long-and-thanks-for-all-the-fish/),
but I like to think the cash register is still out there somewhere
befuddling students and producing its infernal beeping noise.

Nathaniel Beaver, clerk ID 3, September 3, 2023.
