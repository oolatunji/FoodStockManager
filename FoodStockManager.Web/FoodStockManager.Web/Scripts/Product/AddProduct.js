$(document).ready(function () {
    try {

        var currentUrl = window.location.href;
        var user = JSON.parse(window.sessionStorage.getItem("loggedInUser"));
        var userFunctions = user.Function;

        var authorized = false;
        $.each(userFunctions, function (key, userfunction) {
            var link = settingsManager.websiteURL.trimRight('/') + userfunction.PageLink;
            if (currentUrl == link) {
                authorized = true;
            }
        });

        if (!authorized)
            window.location.href = '../System/UnAuthorized';
        else {
            $('#productCategory').html('<option>Loading Product Category...</option>');
            $('#productCategory').prop('disabled', 'disabled');

            //Get Product Category
            $.ajax({
                url: settingsManager.websiteURL + 'api/ProductCategoryAPI/RetrieveProductCategory',
                type: 'GET',
                async: true,
                cache: false,
                success: function (response) {
                    $('#productCategory').html('');
                    $('#productCategory').prop('disabled', false);
                    $('#productCategory').append('<option value="">Select Product Category</option>');
                    var productCategories = response.data;
                    var html = '';
                    $.each(productCategories, function (key, value) {
                        $('#productCategory').append('<option value="' + value.ID + '">' + value.Name + '</option>');
                    });
                },
                error: function (xhr) {
                    displayMessage("error", 'Error experienced: ' + xhr.responseText, "Product Management");
                }
            });
        }
    } catch (err) {
        displayMessage("error", "Error encountered: " + err, "User Management");
    }
});

String.prototype.trimRight = function (charlist) {
    if (charlist === undefined)
        charlist = "\s";

    return this.replace(new RegExp("[" + charlist + "]+$"), "");
};

function addProduct() {
    try {

        var formValid = $('#demo-form').parsley().validate();
        if (formValid) {
            $('#addBtn').html('<i class="fa fa-spinner fa-spin"></i>');
            $("#addBtn").attr("disabled", "disabled");

            var productName = $('#productName').val().toUpperCase();
            var productQuantity = $('#productQuantity').val();
            var productCategory = $('#productCategory').val();
            
            var user = JSON.parse(window.sessionStorage.getItem("loggedInUser"));
            var createdby = user.ID;


            var data = { CategoryID: productCategory, Name: productName, Level: productQuantity, CreatedBy: createdby };
            $.ajax({
                url: settingsManager.websiteURL + 'api/ProductAPI/SaveProduct',
                type: 'POST',
                data: data,
                processData: true,
                async: true,
                cache: false,
                success: function (response) {
                    displayMessage("success", response, "Product Management");
                    $('#productName').val('');
                    $('#productQuantity').val('');
                    $('#productCategory').val('');

                    $("#addBtn").removeAttr("disabled");
                    $('#addBtn').html('Add');
                },
                error: function (xhr) {
                    displayMessage("error", 'Error experienced: ' + xhr.responseText, "Product Management");
                    $("#addBtn").removeAttr("disabled");
                    $('#addBtn').html('Add');
                }
            });
        } else {
            displayMessage("warning", "Fill the required values", "Product Management");
        }
    } catch (err) {
        displayMessage("error", "Error encountered: " + err, "Product Management");
        $("#addBtn").removeAttr("disabled");
        $('#addBtn').html('Add');
    }
}