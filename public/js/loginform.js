const form=document.querySelector('form');
const emailError=document.querySelector('.email_error');
const passwordError=document.querySelector('.password_error');

form.addEventListener('submit', async(e) => {
    e.preventDefault();
    
    // reset errors
    emailError.textContent='';
    passwordError.textContent='';
    
    const email=form.email.value;
    const password=form.password.value;

    try {
        const res= await fetch('/', {
            method:'POST',
            body: JSON.stringify({email: email, password:password}),
            headers:{'Content-Type': 'application/json'}
        });
        const data= await res.json();
        console.log(data);
        if(data.errors){
            emailError.textContent=data.errors.email;
            passwordError.textContent=data.errors.password;
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


