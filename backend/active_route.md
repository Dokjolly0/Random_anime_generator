# Active routes



## auth router

- http://localhost:3000/api/login
  
      post
      {
        "username": "alexviolattolibero.it@gmail.com",
        "password": "Aviolatto03"
      }

      Login and create a token

- http://localhost:3000/api/register
  
      post
      {
          "firstName": "Example",
          "lastName": "Template",
          "username": "example@example.com",
          "password": "Example0!"
      }

      Add an account

- http://localhost:3000/api/confirm-email
  
      get
      Confirm and active email
  
  

## Accunt

- http://localhost:3000/api/users/
  
      get - authenticated
      Get all list account

- http://localhost:3000/api/users/me
  
      get - authenticated
      Get detail account

- http://localhost:3000/api/users/username
  
      get - authenticated
      Get username by id

- http://localhost:3000/api/users/password
  
      post - authenticated
      {
          "newPassword": "A.violatto03"
      }
      
      
      Change account password
