"use strict";function _defineProperty(e,n,o){return n in e?Object.defineProperty(e,n,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[n]=o,e}var signupUrl="https://kvmveb8o06.execute-api.us-east-1.amazonaws.com/dev/authentication/signup",toggleSections=function(e){var n=e.signupSection,o=e.signinSection,t=e.socialSection;n&&toggleClass(n,"hidden"),o&&toggleClass(o,"hidden"),t&&toggleClass(t,"hidden")},toggleButtons=function(e){var n=e.spinButton,o=e.createButton;n&&toggleClass(n,"hidden"),o&&toggleClass(o,"hidden")},toggleForm=function(e){var n=e.name,o=e.email,t=e.password,i=e.age,s=e.maleRadio,a=e.femaleRadio;n&&(n.disabled=!n.disabled),o&&(o.disabled=!o.disabled),t&&(t.disabled=!t.disabled),i&&(i.disabled=!i.disabled),s&&(s.disabled=!s.disabled),a&&(a.disabled=!a.disabled)},hideAlerts=function(e){var n=e.mandatoryFieldsAlert,o=e.userExistsAlert;n&&!hasClass(n,"hidden")&&addClass(n,"hidden"),o&&!hasClass(o)&&addClass(o,"hidden")},showAlert=function(e){return removeClass(e,"hidden")},getUserDataFromSignupForm=function(e){var n=e.name,o=e.email,t=e.password,i=e.age,s=e.maleRadio,a=e.femaleRadio;return Promise.resolve({name:n.value,email:o.value,password:t.value,age:JSON.parse(i.options[i.selectedIndex].value),gender:s.checked?"male":a.checked?"female":void 0})},validateData=function(e){var n=Object.keys(e).map(function(n){return isEmpty(e[n])}).reduce(function(e,n){return e||n},!1);return n?Promise.reject(new Error("Todos los campos son obligatorios.")):Promise.resolve(e)},signupUser=function(e){return fetchLambda(signupUrl,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(e)})},loginUser=function(e,n){n.preventDefault(),toggleButtons(e);var o=e.loginForm,t=map(o.getElementsByClassName("form-control"),function(e){return _defineProperty({},e.name,e.value)});console.log(t)},createUser=function(e,n){n.preventDefault(),toggleButtons(e),toggleForm(e),hideAlerts(e),getUserDataFromSignupForm(e).then(function(e){return validateData(e)}).then(function(e){return signupUser(e)}).then(createUserSuccess.bind(void 0,e)).catch(createUserError.bind(void 0,e))},createUserSuccess=function(e,n){console.log(n),toggleForm(e),window.location.href=n},createUserError=function(e,n){console.error(n);var o=e.userExistsAlert,t=e.mandatoryFieldsAlert;toggleForm(e),"Todos los campos son obligatorios."===n.message&&showAlert(t),"email is in use"===n.message&&showAlert(o)},main=function(e,n){try{var o=["signupSection","signinSection","socialSection","signupForm","loginForm","showSigninSection","showSignupSection","name","email","password","maleRadio","femaleRadio","age","spinButton","createButton","mandatoryFieldsAlert","userExistsAlert"],t=getElementsById(o,e),i=toggleSections.bind(void 0,t),s=createUser.bind(void 0,t),a=loginUser.bind(void 0,t);addEventListener(t.showSigninSection,"click",i),addEventListener(t.showSignupSection,"click",i),addEventListener(t.signupForm,"onsubmit",s),addEventListener(t.loginForm,"onsubmit",a)}catch(e){console.error(e)}};main(document,window);
//# sourceMappingURL=login.js.map
