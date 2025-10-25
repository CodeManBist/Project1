// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// Tax toggle functionality for index page
document.addEventListener('DOMContentLoaded', function() {
    const taxSwitch = document.getElementById('switchCheckDefault');
    const taxSwitchMobile = document.getElementById('switchCheckDefaultMobile');
    
    function toggleTaxInfo() {
        const taxInfo = document.getElementsByClassName('tax-info');
        for (let info of taxInfo) {
            if (info.style.display !== 'inline') {
                info.style.display = 'inline';
            } else {
                info.style.display = 'none';
            }
        }
    }
    
    // Desktop tax toggle
    if (taxSwitch) {
        taxSwitch.addEventListener('click', toggleTaxInfo);
    }
    
    // Mobile tax toggle
    if (taxSwitchMobile) {
        taxSwitchMobile.addEventListener('click', toggleTaxInfo);
    }
    
    // Sync both toggles
    if (taxSwitch && taxSwitchMobile) {
        taxSwitch.addEventListener('change', () => {
            taxSwitchMobile.checked = taxSwitch.checked;
        });
        
        taxSwitchMobile.addEventListener('change', () => {
            taxSwitch.checked = taxSwitchMobile.checked;
        });
    }
    
    // Mobile filter scroll functionality
    const scrollLeft = document.getElementById('scrollLeft');
    const scrollRight = document.getElementById('scrollRight');
    const filtersContainer = document.getElementById('filtersContainer');
    
    if (scrollLeft && scrollRight && filtersContainer) {
        const scrollAmount = 200; // pixels to scroll
        
        scrollLeft.addEventListener('click', () => {
            filtersContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        scrollRight.addEventListener('click', () => {
            filtersContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Show/hide scroll buttons based on scroll position
        function updateScrollButtons() {
            const { scrollLeft, scrollWidth, clientWidth } = filtersContainer;
            
            if (scrollLeft === 0) {
                scrollLeft.style.opacity = '0.3';
                scrollLeft.disabled = true;
            } else {
                scrollLeft.style.opacity = '1';
                scrollLeft.disabled = false;
            }
            
            if (scrollLeft + clientWidth >= scrollWidth) {
                scrollRight.style.opacity = '0.3';
                scrollRight.disabled = true;
            } else {
                scrollRight.style.opacity = '1';
                scrollRight.disabled = false;
            }
        }
        
        // Initial check
        updateScrollButtons();
        
        // Update on scroll
        filtersContainer.addEventListener('scroll', updateScrollButtons);
        
        // Update on window resize
        window.addEventListener('resize', updateScrollButtons);
    }
});
