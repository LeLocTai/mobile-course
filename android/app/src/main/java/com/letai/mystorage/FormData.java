package com.letai.mystorage;

import java.util.Date;

/**
 * Created by Le Loc Tai on 2/28/2019.
 */
public class FormData {
    private String storageType;
    private float size;
    private Date datetime;
    private float rentPrice;
    private String notes;
    private String reporterName;


    private StringBuilder errorStringBuilder;
    private int errorCount;


    public FormData(String storageType, String size, Date datetime, String rentPrice, String notes, String reporterName) {
        errorStringBuilder = new StringBuilder();

        this.storageType = storageType;
        this.size = tryParseFloat(size, "Size");
        this.datetime = datetime;
        this.rentPrice = tryParseFloat(rentPrice, "Rent Price");
        this.notes = notes;
        this.reporterName = reporterName;
    }

    private float tryParseFloat(String s, String name) {
        if(s.ise)
        try {
            return Float.parseFloat(s);
        } catch (NullPointerException e) {
            addError(name + " is required");
        } catch (NumberFormatException e) {
            addError(name + " is not a number");
        }
        return 0;
    }

    public String getErrors() {
        addError(getStorageTypeError());
        addError(getSizeError());
        addError(getDatetimeError());
        addError(getRentPriceError());
        addError(getNotesError());
        addError(getReporterNameError());

        return errorStringBuilder.toString();
    }

    private void addError(String err) {
        if (err == null) {
            return;
        }

        if (errorCount > 0) {
            errorStringBuilder.append("\n");
        }

        errorStringBuilder.append(err);
        errorCount++;
    }

    private String getStorageTypeError() {

        String err = null;

        return err;
    }

    private String getSizeError() {

        String err = null;

        return err;
    }

    private String getDatetimeError() {

        String err = null;

        return err;
    }

    private String getRentPriceError() {

        String err = null;

        return err;
    }

    private String getNotesError() {

        String err = null;

        return err;
    }

    private String getReporterNameError() {

        String err = null;

        return err;
    }
}
