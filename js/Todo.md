# Pinball

## Issues to solve

### calculate collisions with circles

- what if the collision is not a flush hit e.g. on next step they intersect each other
- balls currently don't touch in the simulation - they get one step away from touching

- first ball in the collision has already changed direction - need to change the values at the same time
- hacked to get this to work for 2 balls only - need to uncomment line 83 and get this to work for multiple balls