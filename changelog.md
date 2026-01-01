<details>
<summary>

## Dec 31, 2025:

</summary>

### Updates: (@BahaaJber1)

1.  Added CORS middleware to the Express server to handle cross-origin requests.
1.  Configured the server to parse URL-encoded data and JSON payloads.
1.  Created a `users` table in the database with fields for `id`, `email`, `name`, `password`, `role`, `created_at`, and `updated_at`.
1.  Set up a basic route for user-related operations at `/api/v1/users`.
1.  Separated database query logic from the route handler for better error handling and code clarity.
1.  Updated the Object sent to the frontend to remove sensitive information like passwords.
1.  Implemented user registration functionality with input validation using Zod schemas.
1.  The passwords are securely hashed using **bcrypt** before being stored in the database.
1.  Implemented user login functionality using **Passport.js** with the local strategy for authentication.
1.  Configured Passport.js to serialize and deserialize user information for session management.
1.  Set up success and failure redirects for login attempts.

## TODO:

- Update the cookie to be set on the frontend domain.
- Implement logout functionality to destroy user sessions.
- Create the needed tables/models/schemas for the other functionality.
</details>

---

<details>
<summary>

## Jan 1, 2026:

</summary>

### Updates: (@BahaaJber1)

1. Removed `cookie-session` middleware and continued using `express-session` for session management.
1. Implemented `signout` functionality to destroy sessions upon logout requests.
1. The cookie cookie is now set and persist on the browser's cookie storage.
1. Updated CORS configuration to dynamically set the `origin` based on the environment (development or production).
1. Implemented an `isAuthenticated` controller to check if a user is logged in based on the session.
1. Added a new route `/api/v1/users/verify` to return user information upon successful authentication.
1. Updated the `/api/v1/users/success` route to return only essential user information (role and name).
1. Created the `visits` & `treatments` tables in the database with relevant fields. 

## TODO:

- Create the needed tables/models/schemas for the other functionality.
- Update the `api/v1/visits/book` to show the relevant data/errors.

</details>
