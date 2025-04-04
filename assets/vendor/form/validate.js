
  // To store the email submission count in the browser (localStorage)
  const emailSubmissionCountKey = 'email_submission_count';

  const form = document.querySelector('.php-email-form');
  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission

    const emailField = document.getElementById('email-field');
    const email = emailField.value;
    
    // Check if the email has already submitted more than two times
    let emailSubmissionCount = localStorage.getItem(emailSubmissionCountKey) || 0;
    emailSubmissionCount = parseInt(emailSubmissionCount);

    if (emailSubmissionCount >= 2) {
      alert('You can only send two messages with the same email address.');
      return; // Stop the form submission if the limit is reached
    }

    const formData = new FormData(form);
    
    // Show loading message
    document.querySelector('.loading').style.display = 'block';
    document.querySelector('.error-message').style.display = 'none';
    document.querySelector('.sent-message').style.display = 'none';

    fetch(form.action, {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      document.querySelector('.loading').style.display = 'none';
      if (data.success) {
        // Show success message
        document.querySelector('.sent-message').style.display = 'block';
        document.querySelector('.error-message').style.display = 'none';

        // Increase email submission count and store it in localStorage
        localStorage.setItem(emailSubmissionCountKey, emailSubmissionCount + 1);

        // Clear the form after submission
        form.reset();

        // Hide success message after 2 seconds
        setTimeout(() => {
          document.querySelector('.sent-message').style.display = 'none';
        }, 1000);
      } else {
        // Show error message
        document.querySelector('.sent-message').style.display = 'none';
        document.querySelector('.error-message').style.display = 'block';

        // Hide error message after 2 seconds
        setTimeout(() => {
          document.querySelector('.error-message').style.display = 'none';
        }, 1000);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      document.querySelector('.loading').style.display = 'none';
      document.querySelector('.sent-message').style.display = 'none';
      document.querySelector('.error-message').style.display = 'block';

      // Hide error message after 2 seconds
      setTimeout(() => {
        document.querySelector('.error-message').style.display = 'none';
      }, 1000);
    });
  });
