# Backend Improvements

There are a couple code smells left on the backend:
1. there are no indexes setup for free text searching on columns (this would also be a good use case for a search DB such as opensearch)
2. There's no limit to the amount of data returned. Ideally it would implement some form of pagination (preferably cursor based pagination)
3. The HTTP handler is doing too much:
   1. its handling validation of the HTTP request
   2. its handling figuring out how to structure the query to fulfill the request

   The HTTP endpoint should only handle user input validation and output formatting and call service functions to actually fulfill the user's request. I would at the very least make a module to handle getting advocates and searching.
4. There's no security: no rate limiting, no authentication, etc.

There is also no check in place in the seed or migrate functions to ensure we aren't migrating a non-test database.

# Frontend Improvements

Its not very useful to just show a list of all advocates. There should be a guided search that helps find an advocate that matches what the user is looking for. A couple questions we could ask (These questions are informed by patient caregiver matching fitness):
1. What problem are you facing? (Use this to inform the speciality)
2. Do you have a gender preference?
3. Do you have an age preference?
4. Use the user's location (with the option to override it)

Then we could show a pared down list of just a couple advocates. My hypothesis would be that the less advocates a user has to choose from, the more likely they are to follow through with the matching process.

The UI could also be prettier.

# Tests

I have opted to only implement E2E tests in the interest of time. Given a real project, I would like to see a mix unit, integration, and E2E.

Having a 'fake' data source would actually be really useful for fast and determinstic testing. I would revisit introducing a system to
use the in memory list of advocates from the seed directory for testing.