document.addEventListener("DOMContentLoaded", function () {
  var submitBtn = document.getElementById("submitBtn");
 
  
  var table = document.getElementById("ans");


  

  

  submitBtn.addEventListener("click", function (event) {
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

$(document).ready(function () {

  $.get("/data", function (data) {
    data.forEach(function (row) {
      appendRowToTable(row);
    });

    // Attach event listeners to dynamically added buttons using event delegation
    $("#monthlyFixedCostTable").on("click", ".edit-button", function () {
      var rowId = $(this).data("row-id");
      retrieveRowData(rowId);
    });

    $("#monthlyFixedCostTable").on("click", ".delete-button", function () {
      var rowId = $(this).data("row-id");
      deleteRow(rowId);
    });
  });

  // Add Row button
  $("#addRowButton").click(function () {
    addRow();
  });



 

  function addRow() {
    var newRowData = {
      call_center_name: document.getElementById("call_center_name").value,
      ctc_slab: document.getElementById("ctc_slab").value,
      management_fees: document.getElementById("management_fees").value,
      seat_cost_infra: document.getElementById("seat_cost_infra").value,
      ot_rate_per_hr: document.getElementById("ot_rate_per_hr").value,
      retention_cost: document.getElementById("retention_cost").value,
      effective_start_date: document.getElementById("effective_start_date").value,
      effective_end_date: document.getElementById("effective_end_date").value,
    };

    // Send the new row data to the server
    fetch("/addRow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRowData),
    })
      .then(function (response) {
        if (response.ok) {
          return response.text();
        }
        throw new Error("Error adding row: " + response.status);
      })
      .then(function (result) {
        console.log(result);
        // Refresh the table by loading the updated data
        loadTableData();
      })
      .catch(function (error) {
        console.error("Error adding row:", error);
      });
  }

  function loadTableData() {
    fetch("/data")
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Error retrieving data: " + response.status);
      })
      .then(function (data) {
        // Clear the existing table rows
        $("#monthlyFixedCostTable").empty();

        // Add new rows to the table
        var maxId = 0; // Initialize the maximum ID to 0
        data.forEach(function (row) {
          if (row.id > maxId) {
            maxId = row.id; // Update the maximum ID
          }
          appendRowToTable(row, maxId + 1); // Assign the next available ID
        });
      })
      .catch(function (error) {
        console.error("Error retrieving data:", error);
      });
  }
  // Function to append a row to the table
  function appendRowToTable(row) {
    var newRow = $("<tr>");
    newRow.append($("<td>").text(row.id));
    newRow.append($("<td>").text(row.call_center_name));
    newRow.append($("<td>").text(row.ctc_slab));
    newRow.append($("<td>").text(row.management_fees));
    newRow.append($("<td>").text(row.seat_cost_infra));
    newRow.append($("<td>").text(row.ot_rate_per_hr));
    newRow.append($("<td>").text(row.retention_cost));
    newRow.append($("<td>").text(row.effective_start_date));
    newRow.append($("<td>").text(row.effective_end_date));
    newRow.append(
      $("<td>").html(
        '<button class="edit-button" data-row-id="' +
          row.id +
          '">Edit</button>'
      )
    );
    newRow.append(
      $("<td>").html(
        '<button class="delete-button" data-row-id="' +
          row.id +
          '">Delete</button>'
      )
    );
   
    $("#monthlyFixedCostTable").append(newRow);
  }

  // Function to retrieve row data from the server
  function retrieveRowData(rowId) {
    $.ajax({
      url: "/rowdata/" + rowId,
      method: "GET",
      success: function (data) {
        populateFormFields(data);
      },
      error: function (err) {
        console.error("Error retrieving row data:", err);
      },
    });
  }




  function deleteRow(rowId) {
    $.ajax({
      type: "DELETE",
      url: "/delete/" + rowId,
      success: function (response) {
        console.log("Record deleted successfully:", response);
        // Remove the deleted row from the table
        $("#row-" + rowId).remove();

        // Update the displayed row numbers
        updateRowNumbers();
      },
      error: function (err) {
        console.error("Error deleting the record:", err);
      },
    });
  }

  // Function to update the displayed row numbers
  function updateRowNumbers() {
    var rows = $("#monthlyFixedCostTable tbody tr");
    rows.each(function (index) {
      $(this).find("td:first").text(index + 1);
    });
  }


  // Function to populate form fields with row data
  function populateFormFields(rowData) {
    $("#id").val(rowData.id);
    $("#call_center_name").val(rowData.call_center_name);
    $("#ctc_slab").val(rowData.ctc_slab);
    $("#management_fees").val(rowData.management_fees);
    $("#seat_cost_infra").val(rowData.seat_cost_infra);
    $("#ot_rate_per_hr").val(rowData.ot_rate_per_hr);
    $("#retention_cost").val(rowData.retention_cost);
    $("#effective_start_date").val(rowData.effective_start_date);
    $("#effective_end_date").val(rowData.effective_end_date);
    // Update other form fields accordingly

    // Show the form for editing the row
    $("#edit-form").show();
  }
  // Attach click event handler to the submit button in the edit form
  editSubmit.addEventListener("click", function (event) {
    event.preventDefault();
    var rowId = document.getElementById("id").value;
    updateRecord(rowId);
  });

  // Function to update a specific record on the server
  function updateRecord(rowId) {
    var updatedData = {
      id: $("#id").val(),
      call_center_name: $("#call_center_name").val(),
      ctc_slab: $("#ctc_slab").val(),
      management_fees: $("#management_fees").val(),
      seat_cost_infra: $("#seat_cost_infra").val(),
      ot_rate_per_hr: $("#ot_rate_per_hr").val(),
      retention_cost: $("#retention_cost").val(),
      effective_start_date: $("#effective_start_date").val(),
      effective_end_date: $("#effective_end_date").val(),
      // Add more fields if necessary
    };

    $.ajax({
      type: "POST",
      url: "/update/" + rowId,
      data: updatedData,
      success: function (updatedRow) {
        console.log("Record updated successfully:", updatedRow);
        // Refresh the table or update the specific row with the updated data
        sendEmailNotification(updatedRow);
      },
      error: function (err) {
        console.error("Error updating the record:", err);
      },
    });
  }

  // Function to send email notification
  function sendEmailNotification() {
    // Compose the email content
    var emailData = {
      subject: "Cost Data Updated",
      body: "The cost data has been updated. Please review the changes.",
      // Add recipient(s), sender, or any other necessary fields
    };

    // Send the email using AJAX
    $.post("/sendEmail", emailData)
      .done(function (response) {
        console.log("Email notification sent:", response);
      })
      .fail(function (error) {
        console.error(
          "Error sending email notification:",
          error.responseText
        );
      });
  }
});
