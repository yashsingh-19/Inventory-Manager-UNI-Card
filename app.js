const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const session = require('express-session')



// Mongoose
// mongoose.connect('mongodb://127.0.0.1:27017/test-db', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://code:code@stock.bwxqnl7.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
// Schema
const Schema = mongoose.Schema;
const mySchema = new Schema({
    // dateCreated:String,
    // _id:Number
    user: String,
    pass: String,
    acctype: String
});
const logSchema = new Schema({
    // dateCreated:String,
    // _id:Number
    user: String,
    Last_Signin: String,
    acctype: String
});
const stockSchema = new Schema({
    dateCreated: String,
    user: String,
    product: String,
    detail: String,
    quantity: Number,
});
const codeSchema = new Schema({
    Code: String,
    'Material Description': String
});
// Model
const data = mongoose.model('data', mySchema);
const code = mongoose.model('code', codeSchema);
const stock = mongoose.model('stock', stockSchema);
const logtime = mongoose.model('logtime', logSchema);
// Express
app = express();
app.use('/static', express.static('static'))
app.use(express.urlencoded())
// Session
app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

// Engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'templates'))
//Endpoints
app.get('/', (req, res) => {
    res.render('index')
})
app.get('/logina', (req, res) => {
    res.render('admin')
    // console.log('admin login')
})
app.post('/logina', (req, res) => {
    // console.log(req.body.username)
    // console.log(req.body.password)
    data.find({
        user: req.body.username,
        pass: req.body.password,
        acctype: "admin"
    })
        .then(foundDocument => {
            // console.log('found document is ', foundDocument);

            if (Object.keys(foundDocument).length === 0) {
                // window.alert('Wrong Credentials');
                res.render('admin')
                req.session.logsuccess = false
            }
            else {
                logtime.updateOne({ user: req.body.username }, { Last_Signin: Date(), acctype: "admin" }, { upsert: true })
                    .then(result => {
                        req.session.username = req.body.username;
                        req.session.logsuccess = true
                        req.session.acctype = 'admin'
                        if (req.session.logsuccess == true) {
                            res.render('adminmain')
                        }
                        else {
                            res.render('admin')
                        }
                    })
                    .catch(error => {
                        console.error('Error updating document:', error);
                    });

            }
        })
        .catch(error => {
            console.error('Error saving document:', error);
            res.render('admin')
        });

})
app.get('/logine', (req, res) => {
    res.render('employee')
    // console.log('employee login')
})
app.post('/logine', (req, res) => {
    data.find({
        user: req.body.username,
        pass: req.body.password,
        acctype: "employee"
    })
        .then(foundDocument => {
            // console.log('found document is ', foundDocument);
            if (Object.keys(foundDocument).length === 0) {
                // Window.alert('Wrong Credentials');
                res.render('employee')
                req.session.logsuccess = false
            }
            else {
                logtime.updateOne({ user: req.body.username }, { Last_Signin: Date(), acctype: "eployee" }, { upsert: true })
                    .then(result => {
                        req.session.username = req.body.username;
                        req.session.logsuccess = true
                        req.session.acctype = 'employee'
                        if (req.session.logsuccess == true) {
                            res.render('empmain')
                        }
                        else {
                            res.render('employee')
                        }
                    })
                    .catch(error => {
                        console.error('Error updating document:', error);
                    });

            }
        })
        .catch(error => {
            console.error('Error saving document:', error);
            res.render('employee')
        });
})
app.get('/adminmain', (req, res) => {
    if (req.session.logsuccess == true) {
        res.render('adminmain')
    }
    else {
        res.render('index')
    }
})
app.get('/updatestock', (req, res) => {
    if (req.session.logsuccess == true) {
        res.render('updatestock')
    }
    else {
        res.render('index')
    }

})
app.post('/updatestock', (req, res) => {
    if (req.session.logsuccess == true) {
        req.session.quantity = req.body.quantity
        req.session.note = req.body.note
        const param = { 'note': req.body.note, 'quantity': req.body.quantity }
        res.render('updateconfirmation', param)
        // res.send('updated')

    }
    else {
        res.render('index')
    }
})
app.post('/savestock', (req, res) => {
    if (req.session.logsuccess == true) {
        stock.updateOne({ product: String(req.body.prod).replace(/_/g, ' ') }, { detail: req.session.note, user: req.session.username, dateCreated: Date() }, { upsert: true })
            .then(result => {
                stock.updateOne({ product: String(req.body.prod).replace(/_/g, ' ') }, { $inc: { quantity: Number(req.session.quantity) } })
                    .then(fresult => {
                        res.render('stockconfirm')
                    })
                    .catch(er => {
                        console.error(er)
                    })
                // console.log('Update result:', result);
            })
            .catch(error => {
                console.error('Error updating document:', error);
            });
    }
    else {
        res.render('index')
    }
})
app.get('/viewstock', async (req, res) => {
    if (req.session.logsuccess == true) {
        code.find({})
            .then(founddat => {
                var found = []
                for (const obj of founddat) {
                    const found1 = obj['_doc'].Code
                    const found2 = Object.values(obj['_doc'])[2];
                    found.push(String(found1) + " " + String(found2))
                }
                console.log(found)
                res.render('viewstock', { found })
            })
            .catch(er => {
                console.log(er)
            })
    }
    else {
        res.render('index')
    }
})
app.post('/viewstock', (req, res) => {
    if (req.session.logsuccess == true) {
        var query = req.body.datalist
        // console.log(query)
        stock.find({ product: query })
            .then(out => {
                if (Object.keys(out).length === 0) {
                    const product = 'No data'
                    const date = 'No data'
                    const quantity = 'No data'
                    const user = 'No data'
                    const detail = 'No data'
                    res.render('displaystock', { product, date, quantity, user, detail })
                }
                else {
                    for (const obj of out) {
                        const product = obj['_doc'].product
                        const date = obj['_doc'].dateCreated
                        const quantity = obj['_doc'].quantity
                        const user = obj['_doc'].user
                        const detail = obj['_doc'].detail
                        res.render('displaystock', { product, date, quantity, user, detail })
                    }
                }
            })
            .catch(erur => {
                console.error(erur)
            })
        // res.render('updatestock')
    }
    else {
        // console.log(req.session.logsuccess)
        res.render('index')
    }
});
app.post('/confirmredirectupdate', (req, res) => {
    if (req.session.logsuccess == true) {
        res.render('updatestock')
    }
    else {
        // console.log(req.session.logsuccess)
        if (req.session.acctype == 'admin') {
            res.render('adminmain')
        }
        else {
            res.render('empmain')
        }
    }
});

app.post('/confirmredirecthome', (req, res) => {
    // console.log(req.session.username)
    if (req.session.acctype == 'admin') {
        res.render('adminmain')
    }
    else {
        res.render('empmain')
    }
});
// Redirect route
app.get('/redirect', (req, res) => {
    res.redirect('/');
});
app.get('/registeremp', (req, res) => {
    res.render('registeremp');
});
app.post('/registeremp', (req, res) => {
    data.find({ user: req.body.username })
        .then(doc => {
            if (Object.keys(doc).length === 0) {
                const newuser = new data({
                    user: String(req.body.username).toLowerCase(),
                    pass: String(req.body.password).toLowerCase(),
                    acctype: String(req.body.acctype).toLowerCase()
                });
                const regist = 'Registered ✅'
                const user = String(req.body.username).toLowerCase()
                const pass = String(req.body.password).toLowerCase()
                const acctype = req.body.acctype
                newuser.save()
                    .then(saveduser => {
                        res.render('usercreated.pug', { regist, user, pass, acctype })
                    })
                    .catch(error => {
                        console.error('Error saving document:', error);
                    });
            }
            else {
                const regist = 'Not Registered ⚠️'
                const user = 'User Already Exists'
                const pass = 'User Already Exists'
                const acctype = 'User Already Exists'
                res.render('usercreated.pug', { regist, user, pass, acctype })
            }
        })
});
app.get('/removeemp', (req, res) => {
    data.find({})
        .then(dat => {
            if (Object.keys(dat).length === 0) {
                const found = "null"
                res.render('removeemp', { found });
            }
            else {
                var found = []
                for (const obj of dat) {
                    const user = obj['_doc'].user
                    found.push(user)
                }
                // console.log(found)
                res.render('removeemp', { found })
            }
        })
});
app.post('/deleteuser', (req, res) => {
    const deleteduser=req.body.delete
    data.deleteOne({user:deleteduser})
        .then(done=>{
            // console.log(done)
            res.render('userdeleted',{deleteduser})
        })
        .catch(ercath=>{
            console.error(ercath)
        })
});
//server 
app.listen(80, () => {
    console.log('strated at http://127.0.0.1/')
})
