const express = require("express")
const fs = require("fs");
const app = express()

// accepting server json data
app.use(express.json())

const PORT = 4000

// comes 2nd time and get direct access without login
// app.get('/callback', authToken, (req, res) => {
//     res.json(users.filter((user) => user.user === req.user.user))
// })

// middleware to verify the token
// function authToken(req, res, next) {
//     const authHeader = req.headers['authorization'] // bearer
//     const token = authHeader && authHeader.split(' ')[1]
//     if(token == null){
//         res.send("Token not found")
//     }else{
//         jwt.verify(token, ACCESS_SECRET, (err, user) => {
//             if(err) return res.send('Incorrect Token')
//             req.user = user
//             next()
//         })
//     }
// }

// Login route
// app.post('/login', async (req, res) => {
//     const user1 = users.find(user => user.user == req.body.user)
//     if(user1 == null){
//         res.send("Can't find user")
//     }else{
//         try {
//             if(await bcrypt.compare(req.body.password, user1.password)){
//                 const token = jwt.sign({user: req.body.user}, ACCESS_SECRET, {expiresIn: '5m'})
//                 res.send({id_token: token})
//             }else{
//                 res.send('Incorrect Password')
//             }
//         }catch {
//             res.send('Something went wrong')
//         }
//     }
// })

app.post('/write-data', async (req, res) => {
    

    var data = JSON.stringify(req.body.data);
    
    fs.appendFile("data.json", data, (err) => {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
      res.send('written')
    });
})

// Server listening
app.listen(PORT, (err) => {
    if(err){
        console.log('Server not started. ')
    }else{
        console.log('Server running on PORT ', PORT)
    }
})

