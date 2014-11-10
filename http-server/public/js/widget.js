/*$(document).ready(function() {
   var url = 'data/employees.json';
   var callback = function(response) {
      var statusHTML = '<ul class="bulleted">';
      $.each(response, function(index, employees) {
         if (employees.inoffice === true) {
            statusHTML += '<li class="in">';
         } else {
            statusHTML += '<li class="out">';
         }
         statusHTML += employees.name + '</li>';
      });
      statusHTML += '</ul>';
      $('#employeeList').html(statusHTML);
   }; //end callback

   $.getJSON(url, callback); // Show me the $$$

}); //end ready

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
*/
