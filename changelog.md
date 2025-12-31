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
