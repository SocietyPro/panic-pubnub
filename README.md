panic-pubnub
============

This is a pubnub implementation of a panic button for EVE Online.

Usage
-----

    $ npm install
    $ node node_modules/grunt/bin/grunt

Scratch
-------
Problem - trolls will spam pubnub
Solution - trolls must spam to our relay server
  the relay server requires the message to include a sig
  the relay server discards unwanted messages

Problem: nontrolls must now have a sig
Solution: pantheon keygen, js in browser to make OT creds