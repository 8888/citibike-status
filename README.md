# citibike-status
iOS shortcut enabled citibike dock updates. This is a simple script that queries Citibike's public station status APIs and outputs a string describing which stations have docks available. It is meant to be called as part of an iOS shortcut that will be executed based on GPS location when near the desired Citibike docks. The shortcut will automatically have Siri read the output message so I do not have to use my phone will riding the bike.

# environment
This was written in and meant to run in the iOS javascript editor and interpreter [Scriptable](https://scriptable.app/).

# iOS shortcuts
### shortcut config
```yml
scriptable:
  - Run Bike-Status
documents:
  - Speak Output
```
### automation config
```yml
When:
 - When I arrive at ${address}
Do:
 - Run Shortcut Bike-Status
```
I set the address as 2 blocks away from where I need to decide which dock to go to and with a radius of 350'.
