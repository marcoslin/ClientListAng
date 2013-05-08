/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

/*globals describe, beforeEach, module, it, browser, input, expect, repeater, element */
/*jslint vars: true, node: true */

describe('client.app', function () {
    'use strict';

    describe('List View', function () {
        it('resetdb', function () {
            browser().navigateTo('/reloadb/utest');
        });

        beforeEach(function () {
            browser().navigateTo('/#/list');
        });

        it('initial population should be 10', function () {
            expect(repeater('.full_name').count()).toBe(10);
        });

        it('filter by Rome should return 2', function () {
            input('filter.name').enter('Rome');
            expect(repeater('.full_name').count()).toBe(2);
        });

        it('clicking a name should take user to edit page', function () {
            // 3rd item should be 'Charlene Wong' with object_id of 10
            element(".full_name:eq(2)").click();
            expect(browser().location().url()).toBe("/10");
            expect(element("#form_title").text()).toBe("Edit Client");
            // Make sure cancel works
            element("#cancel_detailForm").click();
            expect(browser().location().url()).toBe("/list");
        });

        it('clicking Add button should take user to add page', function () {
            element("#add_client").click();
            expect(browser().location().url()).toBe("/add");
            expect(element("#form_title").text()).toBe("Add a New Client");
            // Make sure cancel works
            element("#cancel_detailForm").click();
            expect(browser().location().url()).toBe("/list");
        });

        it('delete should not take place if Cancel button clicked.', function () {
            element(".delete:eq(1)").click();
            expect(element(".modal-header h1").text()).toMatch(/Carla Musselwhite/);
            element(".modal-footer .confirm-cancel").click();
            expect(repeater('.full_name').count()).toBe(10);
        });

        it('clicking Quick Add should add a "New Client"', function () {
            element('#quick_add').click();
            expect(repeater('.full_name').count()).toBe(11);
            expect(element('.full_name:eq(7)').text()).toMatch(/New Client/);
        });

        it('delete should drop population to 9 after delete', function () {
            element(".delete:eq(7)").click();
            expect(element(".modal-header h1").text()).toMatch(/New Client/);
            element(".modal-footer .confirm-ok").click();
            expect(repeater('.full_name').count()).toBe(10);
            // Make sure that alert services display a success message
            expect(repeater('#alert_section .alert-success').count()).toBe(1);
            expect(element(".alert div span:first-of-type").text()).toMatch(/New Client/);
            // Make sure taht alert can be closed
            element('#alert_section .alert .close').click();
            expect(repeater("#alert_section .alert").count()).toBe(0);
        });



    });

    describe('Edit View', function () {
        it('resetdb', function () {
            browser().navigateTo('/reloadb/utest');
        });

        beforeEach(function () {
            browser().navigateTo('/#/9');
        });

        it('checking client name loaded', function () {
            expect(input("client.first_name").val()).toBe("Milly");
            expect(input("client.last_name").val()).toBe("Chen");
        });

        it('should not save without required field', function () {
            input("client.first_name").enter("");
            element("#submit_detailForm").click();
            expect(repeater(".alert").count()).toBe(0);
            expect(browser().location().url()).toBe("/9");
        });

        it('successful save should redirect to list view', function () {
            input("client.first_name").enter("Brian");
            input("client.first_name").enter("Ford");
            element("#submit_detailForm").click();
            expect(browser().location().url()).toBe("/list");
        });

    });

    describe('Add View', function () {
        it('resetdb', function () {
            browser().navigateTo('/reloadb/utest');
        });

        beforeEach(function () {
            browser().navigateTo('/#/add');
        });

        it('should not submit without last name.', function () {
            input("client.first_name").enter("John");
            element("#submit_detailForm").click();
            expect(repeater(".alert").count()).toBe(0);
        });

        it('successful submit should show alert', function () {
            input("client.first_name").enter("John");
            input("client.last_name").enter("Tester");
            element("#submit_detailForm").click();

            // Make sure that alert services display a success message
            expect(repeater("#alert_section .alert").count()).toBe(1);
            expect(element("#alert_section .alert div span:first-of-type").text()).toMatch(/John Tester/);
            // Make sure taht alert can be closed
            element('#alert_section .alert .close').click();
            expect(repeater("#alert_section .alert").count()).toBe(0);
        });


    });

});
