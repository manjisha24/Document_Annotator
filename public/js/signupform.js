// form
// let formBtn = document.querySelector('.submit-btn');
// let loader = document.querySelector('.loader');
const form=document.querySelector('form');
const fullnameError=document.querySelector('.fullname_error');
const emailError=document.querySelector('.email_error');
const passwordError=document.querySelector('.password_error');
const numberError=document.querySelector('.number_error');

form.addEventListener('submit', async(e) => {
    e.preventDefault();
    
    // reset errors
    fullnameError.textContent='';
    emailError.textContent='';
    passwordError.textContent='';
    numberError.textContent='';
    
    /*let fullname = document.querySelector('#name') || null;
    let email = document.querySelector('#email');
    let password = document.querySelector('#password');
    let number = document.querySelector('#number') || null;
    let tac = document.querySelector('#tc') || null;*/

    const fullname=form.fullname.value;
    const email=form.email.value;
    const password=form.password.value;
    const number=form.number.value;

    // console.log(fullname, email, password, number);
    try {
        const res= await fetch('/signup', {
            method:'POST',
            body: JSON.stringify({fullname: fullname, email: email, password:password, number:number}),
            headers:{'Content-Type': 'application/json'}
        });
        const data= await res.json();
        console.log(data);
        if(data.errors){
            fullnameError.textContent=data.errors.fullname;
            emailError.textContent=data.errors.email;
            passwordError.textContent=data.errors.password;
            numberError.textContent=data.errors.number;
        }
        if(!data.errors){
            location.assign('/dashboard');
        }
    } catch (error) {
        console.log(error);
    }

    /*
    if(fullname != null){// singup page
        // form validation
        if(fullname.value.length < 3){
            showFormError('name must be 3 letters long');
        } else if(!email.value.length){
            showFormError('enter your email');
        } else if(password.value.length < 8){
            showFormError('password must be 8 letters long');
        } else if(Number(number) || number.value.length < 10){
            showFormError('invalid number, please enter valid one');
        } else{
            // submit form
            loader.style.display = 'block';
            sendData('/signup', {
                name: fullname.value,
                email: email.value,
                password: password.value,
                number: number.value
            })
        }
    } else{// login page
        if(!email.value.length || !password.value.length){
            showFormError('fill all the inputs')
        } else{
            // submit form
            loader.style.display = 'block';
            sendData('/login', {
                email: email.value,
                password: password.value
            })
        }
    }
    */
})


