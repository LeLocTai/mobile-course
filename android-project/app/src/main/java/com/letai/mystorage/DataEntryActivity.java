package com.letai.mystorage;

import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.TimePicker;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;

public class DataEntryActivity extends AppCompatActivity
{
    private Spinner  storageTypeSpinner;
    private EditText sizeInput;
    private EditText dateInput;
    private EditText timeInput;
    private EditText rentPriceInput;
    private EditText notesInput;
    private EditText reporterNameInput;
    private Calendar calendar;

    private TextView errorText;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        findViews();

        prepareStorageTypeSpinner();
        prepareDateTimePicker();
        errorText.setText("");

        Button submitBtn = findViewById(R.id.button_submit);
        submitBtn.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                FormData formData = new FormData(
                        storageTypeSpinner.getSelectedItem().toString(),
                        sizeInput.getText().toString(),
                        calendar.getTime(),
                        rentPriceInput.getText().toString(),
                        notesInput.getText().toString(),
                        reporterNameInput.getText().toString()
                );

                errorText.setText(formData.getErrors());
            }
        });
    }

    private void findViews()
    {
        storageTypeSpinner = findViewById(R.id.input_storage_type);
        sizeInput = findViewById(R.id.input_size);
        dateInput = findViewById(R.id.input_date);
        timeInput = findViewById(R.id.input_time);
        rentPriceInput = findViewById(R.id.input_rent_price);
        notesInput = findViewById(R.id.input_notes);
        reporterNameInput = findViewById(R.id.input_reporter_name);

        errorText = findViewById(R.id.errorText);
    }

    private void prepareStorageTypeSpinner()
    {
        storageTypeSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener()
        {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id)
            {

            }

            @Override
            public void onNothingSelected(AdapterView<?> parent)
            {

            }
        });

        ArrayAdapter<String> adapter = new ArrayAdapter<>(
                this,
                android.R.layout.simple_spinner_item,
                new String[]{
                        "Home",
                        "Business"
                });

        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);

        storageTypeSpinner.setAdapter(adapter);
    }

    private void prepareDateTimePicker()
    {
        calendar = Calendar.getInstance();

        final DatePickerDialog.OnDateSetListener dateSetListener = new DatePickerDialog.OnDateSetListener()
        {
            @Override
            public void onDateSet(DatePicker datePicker, int y, int m, int d)
            {
                calendar.set(Calendar.YEAR, y);
                calendar.set(Calendar.MONTH, m);
                calendar.set(Calendar.DAY_OF_MONTH, d);

                SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy", Locale.US);

                dateInput.setText(sdf.format(calendar.getTime()));
            }
        };

        dateInput.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View view)
            {
                new DatePickerDialog(
                        DataEntryActivity.this,
                        dateSetListener,
                        calendar.get(Calendar.YEAR),
                        calendar.get(Calendar.MONTH),
                        calendar.get(Calendar.DAY_OF_MONTH)
                ).show();
            }
        });

        final TimePickerDialog.OnTimeSetListener timeSetListener = new TimePickerDialog.OnTimeSetListener()
        {
            @Override
            public void onTimeSet(TimePicker view, int hourOfDay, int minute)
            {
                calendar.set(Calendar.HOUR_OF_DAY, hourOfDay);
                calendar.set(Calendar.MINUTE, minute);

                timeInput.setText(hourOfDay + ":" + minute);
            }
        };

        timeInput.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                TimePickerDialog timePickerDialog = new TimePickerDialog(
                        DataEntryActivity.this,
                        timeSetListener,
                        calendar.get(Calendar.HOUR_OF_DAY),
                        calendar.get(Calendar.MINUTE),
                        true
                );

                timePickerDialog.show();
            }
        });
    }
}
