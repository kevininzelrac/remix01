- Test types using tsd (if it makes sense)
- Add functional tests for the code
- Add a prisma package to allow prisma authorization
- Once happy with the way authorization works, deploy this as a scoped package
- PROPOSAL: Instead of can/cannot/accessible on RuleSet, have a method called
  getRule that returns a class with all the resolved filters for the passed in
  arguments. can/cannot/accessible are methods of this new class so you can
  call these functions without executing rules every time. Helpful if one wants
  to use can/cannot and then use accessible.
