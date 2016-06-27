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
        if (window.sessionStorage.getItem('productCategory') === null) {
            window.location.href = '../ProductCategory/ViewProductCategory';
        } else {
            var data = JSON.parse(window.sessionStorage.getItem('productCategory'));
            $('#productCategoryName').val(data.Name);
        }
    }
});

String.prototype.trimRight = function (charlist) {
    if (charlist === undefined)
        charlist = "\s";

    return this.replace(new RegExp("[" + charlist + "]+$"), "");
};

function updateProductCategory() {
    try {
        var formValid = $('#demo-form').parsley().validate();
        if (formValid) {
            $('#updateBtn').html('<i class="fa fa-spinner fa-spin"></i>');
            $("#updateBtn").attr("disabled", "disabled");

            var name = $('#productCategoryName').val().toUpperCase();

            var user = JSON.parse(window.sessionStorage.getItem("loggedInUser"));
            var lastupdatedby = user.ID;

            var productCategory = JSON.parse(window.sessionStorage.getItem('productCategory'));
            var id = productCategory.ID;

            var data = { Name: name, LastUpdatedBy: lastupdatedby, ID: id };
            $.ajax({
                url: settingsManager.websiteURL + 'api/ProductCategoryAPI/UpdateProductCategory',
                type: 'PUT',
                data: data,
                processData: true,
                async: true,
                cache: false,
                success: function (response) {
                    displayMessage("success", response, "Product Category Management");
                    $("#updateBtn").removeAttr("disabled");
                    $('#updateBtn').html('Update');
                },
                error: function (xhr) {
                    displayMessage("error", 'Error experienced: ' + xhr.responseText, "Product Category Management");
                    $("#updateBtn").removeAttr("disabled");
                    $('#updateBtn').html('Update');
                }
            });
        } else {
            displayMessage("warning", "Fill the required values", "Product Category Management");
        }
    } catch (err) {
        displayMessage("error", "Error encountered: " + err, "Product Category Management");
        $("#updateBtn").removeAttr("disabled");
        $('#updateBtn').html('Update');
    }
}
