var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
   if (xhr.readyState === 4) {
      var employees = JSON.parse(xhr.responseText);
      var statusHTML = '<ul class="bulleted">';
      for (var i = 0; i < employees.length; i += 1) {
         if (employees[i].inoffice === true) {
            statusHTML += '<li class="in">';
         } else {
            statusHTML += '<li class="out">';
         }
         statusHTML += employees[i].name;
         statusHTML += '</li>';
      }
      statusHTML += '</ul>';
      document.getElementById('employeeList').innerHTML = statusHTML;
   }
};
xhr.open('GET', 'data/employees.json');
xhr.send();


$(document).ready(function() {
   var url = 'data/rooms.json';

   var callback = function(response) {

      var statusHTML = '<ul class="availability">';

      $.each(response, function(index, rooms) {

         if (rooms.available === true) {
            statusHTML += '<li class="empty">';

         } else {
            statusHTML += '<li class="full">';
         }

         statusHTML += rooms.room + '</li>';

      }); // end loop

      statusHTML += '</ul>';

      $('#roomList').html(statusHTML);

   }; // end callback

   $.getJSON(url, callback); // Show me the $$$

}); //end ready
