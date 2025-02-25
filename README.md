# Simple WebApp To Browse Through Movie Titles Using OMDb APIs.

## Steps to run:
1. Open the deployed link: https://playful-blancmange-faca22.netlify.app/
   or
   Clone the repo to local machine and then open index.html file.

3. Open the browser console under developer tools.  (RIght click -> Inspect -> Console Tab or Respective keyboard Shortcut).
   
   ![Screenshot from 2025-02-25 19-46-37](https://github.com/user-attachments/assets/e6185603-4e7a-4cb5-86e7-0c6ec2357331)

   ![image](https://github.com/user-attachments/assets/d87e95b2-38e6-40a8-8a38-bcfe6aa9b0fa)

5.  In the console tpye:  
```sessionStorage.setItem("key", "3f5xxxxx");```

Here 3f5xxxxx is the 8 character api key.

    ![image](https://github.com/user-attachments/assets/b1cd96da-da9e-4bb3-b9b4-cce0602f54ba)

7. Close the console and Enjoy...

   ![image](https://github.com/user-attachments/assets/baac6d06-f47a-4879-a02d-edbdfa1653c8)


*Assumptions:
In this example we are injecting the key from session storage. In real world scenario, authentication must be implemented, which will store the key in the sessionStorage after successefull authentication using bakend APIs. Also, an OMDBb JSON object doens't have a trailer link. We have assumed a trailer field and fixed it with a placeholder.*
