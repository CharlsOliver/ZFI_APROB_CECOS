sap.ui.define([
	"sap/ui/core/format/DateFormat"
], function (DateFormat) {
	"use strict";
	return {
		formatDateShort: function (iDate) {
			if (!iDate) {
				return null;
			}

			let sDate = iDate.toString().trim();
			let dateObject;

			if (sDate.length === 8 && /^\d{8}$/.test(sDate)) {
				// Formato yyyyMMdd
				let year = sDate.substring(0, 4);
				let month = sDate.substring(4, 6);
				let day = sDate.substring(6, 8);
				dateObject = new Date(Date.UTC(year, month - 1, day));
			} else if (sDate.length === 10 && sDate.includes('.')) {
				// Formato dd.MM.yyyy
				let [day, month, year] = sDate.split('.');
				if (day && month && year) {
					dateObject = new Date(Date.UTC(year, month - 1, day));
				}
			} else {
				return null;
			}

			if (isNaN(dateObject.getTime())) {
				return null;
			}

			sap.ui.getCore().getConfiguration().setFormatLocale("es");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				style: "medium"
			});

			var formattedDate = oDateFormat.format(dateObject);

			return formattedDate;
		},
		
		xToBoolean: function (value) {
            return value === "X";
        }
	};
});