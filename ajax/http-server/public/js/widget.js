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


var widget = new XMLHttpRequest();
widget.onreadystatechange = function() {
   if (widget.readyState === 4) {
      var rooms = JSON.parse(widget.responseText);
      var statusHTML = '<ul class="availability">';
      for (var i = 0; i < rooms.length; i += 1) {
         if (rooms[i].available === true) {
            statusHTML += '<li class="empty">';
         } else {
            statusHTML += '<li class="full">';
         }
         statusHTML += rooms[i].room;
         statusHTML += '</li>';
      }

      statusHTML += '</ul>';
      document.getElementById('roomList').innerHTML = statusHTML;
   }
};
widget.open('GET', 'data/rooms.json');
widget.send();
