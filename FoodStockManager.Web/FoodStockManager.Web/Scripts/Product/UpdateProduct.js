$(document).ready(function () {

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

    if (!authorized) {
        window.location.href = '../System/UnAuthorized';
    } else {
        if (window.sessionStorage.getItem('product') === null) {
            window.location.href = '../Product/ViewProduct';
        } else {
            var data = JSON.parse(window.sessionStorage.getItem('product'));
            $('#productName').val(data.Name);
            $('#productQuantity').val(data.Level);

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
                    var categories = response.data;
                    $.each(categories, function (key, value) {
                        if (data.ProductCategoryID == value.ID)
                            $('#productCategory').append('<option selected="selected" value="' + value.ID + '">' + value.Name + '</option>');
                        else
                            $('#productCategory').append('<option value="' + value.ID + '">' + value.Name + '</option>');
                    });
                },
                error: function (xhr) {
                    displayMessage("error", 'Error experienced: ' + xhr.responseText, "Product Management");
                }
            });
        }
    }
});

String.prototype.trimRight = function (charlist) {
    if (charlist === undefined)
        charlist = "\s";

    return this.replace(new RegExp("[" + charlist + "]+$"), "");
};

function updateProduct() {
    try {
        var formValid = $('#demo-form').parsley().validate();
        if (formValid) {
            $('#updateBtn').html('<i class="fa fa-spinner fa-spin"></i>');
            $("#updateBtn").attr("disabled", "disabled");

            var productName = $('#productName').val();
            var productQuantity = $('#productQuantity').val();
            var productCategory = $('#productCategory').val();

            var user = JSON.parse(window.sessionStorage.getItem("loggedInUser"));
            var lastupdatedby = user.ID;

            var product = JSON.parse(window.sessionStorage.getItem('product'));
            var id = product.ID;

            var data = { CategoryID: productCategory, Name: productName, Level: productQuantity, LastUpdatedBy: lastupdatedby, ID: id };

            $.ajax({
                url: settingsManager.websiteURL + 'api/ProductAPI/UpdateProduct',
                type: 'PUT',
                data: data,
                processData: true,
                async: true,
                cache: false,
                success: function (response) {
                    displayMessage("success", response, "Product Management");
                    $("#updateBtn").removeAttr("disabled");
                    $('#updateBtn').html('Update');
                },
                error: function (xhr) {
                    displayMessage("error", 'Error experienced: ' + xhr.responseText, "Product Management");
                    $("#updateBtn").removeAttr("disabled");
                    $('#updateBtn').html('Update');
                }
            });
        } else {
            displayMessage("warning", "Fill the required values", "Product Management");
        }
    } catch (err) {
        displayMessage("error", "Error encountered: " + err, "Product Management");
        $("#updateBtn").removeAttr("disabled");
        $('#updateBtn').html('Update');
    }
}
