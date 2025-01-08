// Email validation function
function isValidEmail(email) {
  // Regular expression for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
const contactForm = document.getElementById('contactForm');
const securityAnswer = document.getElementById('securityAnswer');
const result = document.getElementById('result');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();
  result.textContent = 'Submitting form...';

  // Validate email
  const emailInput = document.getElementById('email');
  if (!isValidEmail(emailInput.value)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Log the FormData key-value pairs for debugging
  const formData = new FormData(contactForm);
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }

  // Submit the form data using fetch
  fetch(contactForm.action, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: formData,
  })
    .then((response) => {
      return response.json().then((data) => {
        if (response.ok) {
          return data;
        } else {
          // Log error data from Formspree
          console.error('Formspree error:', data);
          // Construct error message from Formspree errors
          let errorMessage = 'Form submission failed';
          if (data.errors && data.errors.length > 0) {
            errorMessage = data.errors.map((error) => error.message).join(', ');
          }
          throw new Error(errorMessage);
        }
      });
    })
    .then((data) => {
      alert('Form submitted successfully!');
      result.textContent = 'Form submitted successfully!';
      contactForm.reset();
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('An error occurred while submitting the form: ' + error.message);
      result.textContent = 'An error occurred: ' + error.message;
    });
});
