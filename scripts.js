document.addEventListener("DOMContentLoaded", function() {
  var submitBtn = document.getElementById("submitBtn");
  var table = document.getElementById("ans");

  submitBtn.addEventListener("click", function(event) {
    event.preventDefault();
   
    var callCenterName1 = document.getElementById("callCenterName1").value;
    var employeeType1 = document.getElementById("employeeType1").value;
    var employeeStatus1 = document.getElementById("employeeStatus1").value;
    var managementFees1 = document.getElementById("managementFees1").value;

    if (
      callCenterName1 === "" ||
      employeeType1 === "" ||
      employeeStatus1 === "" ||
      managementFees1 === ""
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    var calculatedCost = calculateManagementFeesCost(
      callCenterName1,
      employeeType1,
      employeeStatus1,
      managementFees1
    );

    // Clear the table
    table.innerHTML = "";

    var newRow = table.insertRow();
    var cell1 = newRow.insertCell(0);
    cell1.innerHTML = "Calculated Cost";
    var cell2 = newRow.insertCell(1);
    cell2.innerHTML = calculatedCost;
  });

  function calculateManagementFeesCost(
    callCenterName1,
    employeeType1,
    employeeStatus1,
    managementFees1
  ) {
    if (
      (callCenterName1 === "3i Infotech" ||
        callCenterName1 === "KGISL" ||
        callCenterName1 === "Ienergizer") &&
      employeeType1 !== "Training" &&
      employeeStatus1 === "Eligible"
    ) {
      return managementFees1 * 100;
    }
    return 0;
  }
});

$(document).ready(function() {
  // Fetch the data from the server and populate the table
  $.get('/data', function(data) {
    data.forEach(function(row) {
      var newRow = $('<tr>');
      newRow.append($('<td>').text(row.id));
      newRow.append($('<td>').text(row.call_center_name));
      newRow.append($('<td>').text(row.ctc_slab));
      newRow.append($('<td>').text(row.management_fees));
      newRow.append($('<td>').text(row.seat_cost_infra));
      newRow.append($('<td>').text(row.ot_rate_per_hour));
      newRow.append($('<td>').text(row.retention_cost));
      newRow.append($('<td>').text(row.effective_date));
      newRow.append($('<td>').html('<button class="edit-button" data-row-id="' + row.id + '">Edit</button>'));
      $('#monthlyFixedCostTable').append(newRow);
    });

    // Attach click event handler to the edit buttons
    $('.edit-button').click(function() {
      var rowId = $(this).data('row-id');
      retrieveRowData(rowId);
    });

    // Function to retrieve row data from the server
    function retrieveRowData(rowId) {
      $.ajax({
        url: '/rowdata/' + rowId,
        method: 'GET',
        success: function(data) {
          populateFormFields(data);
        },
        error: function(err) {
          console.error('Error retrieving row data:', err);
        }
      });
    }

    // Function to populate form fields with row data
    function populateFormFields(rowData) {
      $('#id').val(rowData.id);
      
      $('#call_center_name').val(rowData.call_center_name);
      $('#ctc_slab').val(rowData.ctc_slab);
      $('#management_fees').val(rowData.management_fees);
      $('#seat_cost_infra').val(rowData.seat_cost_infra);
      $('#ot_rate_per_hr').val(rowData.ot_rate_per_hr);
      $('#retention_cost').val(rowData.retention_cost);
      // Update other form fields accordingly

      // Show the form for editing the row
      $('#edit-form').show();
    }

    // Attach click event handler to the submit button in the edit form
    
       editSubmit.addEventListener("click", function(event) {
        event.preventDefault();
        var rowId = document.getElementById("id").value;
      updateRecord(rowId);
    });
  
    // Function to update a specific record on the server
    function updateRecord(rowId) {
      var updatedData = {
        id: $('#id').val(),
        call_center_name: $('#call_center_name').val(),
        ctc_slab: $('#ctc_slab').val(),
        management_fees: $('#management_fees').val(),
        seat_cost_infra: $('#seat_cost_infra').val(),
        ot_rate_per_hr: $('#ot_rate_per_hr').val(),
        retention_cost: $('#retention_cost').val()
        // Add more fields if necessary
      };
  
      $.ajax({
        type: 'POST',
        url: '/update/' + rowId,
        data: updatedData,
        success: function(updatedRow) {
          console.log('Record updated successfully:', updatedRow);
          // Refresh the table or update the specific row with the updated data
          sendEmailNotification(updatedRow);
          
        },
        error: function(err) {
          console.error('Error updating the record:', err);
        }
      });
    }
    // Function to send email notification

  });
  // Function to send email notification
  function sendEmailNotification() {
    // Compose the email content
    var emailData = {
      subject: 'Cost Data Updated',
      body: 'The cost data has been updated. Please review the changes.',
      // Add recipient(s), sender, or any other necessary fields
    };
  
    // Send the email using AJAX
    $.post('/sendEmail', emailData)
      .done(function(response) {
        console.log('Email notification sent:', response);
      })
      .fail(function(error) {
        console.error('Error sending email notification:', error.responseText);
      });
  }
});
