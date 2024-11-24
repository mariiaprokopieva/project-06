import { Locator, test, expect } from "@playwright/test";
import { clickButton, typeText } from "../../helpers/click_and_fill_helpers";

test.describe('Todo list', () => {
    test.beforeEach(async ({ page }) => {
        test.step('1. Navigate to https://techglobal-training.com/frontend/project-6', async() => {
            await page.goto("https://www.techglobal-training.com/frontend/");
            await page.getByRole('link', {name: 'Todo List'}).click();
        })
    });

    test('Test Case 01 - Todo-App Modal Verification', async({ page }) => {
        const toDoAppModal = page.locator('section');
        const modalTitle = page.locator('.panel-heading');
        const newToDoInput = page.locator('#input-add');
        const addButton = page.locator('#add-btn');
        const searchField = page.locator('#search');
        const tasks = page.locator('#panel .panel-block div');
        const message = page.locator('.has-text-danger');

        await test.step('2. Confirm that the todo-app modal is visible with the title “My Tasks”', async() => {
            await expect(toDoAppModal).toBeVisible();
            await expect(modalTitle).toHaveText('My Tasks');
        });

        await test.step('3. Validate that the New todo input field is enabled for text entry', async() => {
            await expect(newToDoInput).toBeEnabled();
        });

        await test.step('4. Validate ADD button is enabled', async() => {
            await expect(addButton).toBeEnabled();
        });

        await test.step('5. Validate Search field is enabled', async() => {
            await expect(searchField).toBeEnabled();
        });

        await test.step('6. Validate that the task list is empty, displaying the message “No tasks found!”', async() => {
            await expect(tasks).toHaveCount(0);
            await expect(message).toHaveText('No tasks found!');
        });
    });

    test('Test Case 02 - Single Task Addition and Removal', async({ page }) => {
        
        const tasks = page.locator('#panel .panel-block div');
        const removeButton = page.locator('.destroy');
        const taskStatus = page.locator('#panel .panel-block span').first();
        const message = page.locator('.has-text-danger');

        await test.step('2. Enter a new task in the todo input field and add it to the list', async() => {
            await typeText(page, 'New todo', 'Playwright project');
            await clickButton(page, 'ADD');
        });

        await test.step('3. Validate that the new task appears in the task list', async() => {
            await expect(tasks).toHaveText('Playwright project');
        });

        await test.step('4. Validate that the number of tasks in the list is exactly one', async() => {
            expect(tasks).toHaveCount(1);
        });

        await test.step('5. Mark the task as completed by clicking on it', async() => {
            await tasks.click();
        });

        await test.step('6. Validate item is marked as completed', async() => {
            expect(taskStatus).toHaveClass(/has-text-success/);
        });

        await test.step('7. Click on the button to remove the item you have added', async() => {
            removeButton.click();
        });
    
        await test.step('8. Validate that the task list is empty, displaying the message “No tasks found!”', async() => {
            await expect(tasks).toHaveCount(0);
            await expect(message).toHaveText('No tasks found!');
        });
    });

    test('Test Case 03 - Multiple Task Operations', async({ page }) => {

        const todoTasks = [ 'clean', 'workout', 'cook', 'study', 'call mom' ];

        const tasks = page.locator('#panel .panel-block div');
        const message = page.locator('.has-text-danger');

        await test.step('2. Enter and add 5 to-do items individually', async() => {
            for(const task of todoTasks) {
                await typeText(page, 'New todo', task);
                await clickButton(page, 'ADD');
            }
        });

        await test.step('3. Validate that all added items match the items displayed on the list', async() => {
            const tasksArray = await tasks.all();

            for(let i = 0; i < tasksArray.length; i++) {
                await expect(tasksArray[i]).toHaveText(todoTasks[i]);
            }
        });

        await test.step('4. Mark all the tasks as completed by clicking on them', async() => {
            const tasksArray = await tasks.all();

            for(const task of tasksArray) {
                await task.click();
            }
        });

        await test.step('5. Click on the “Remove completed tasks!” button to clear them', async() => {
            clickButton(page, 'Remove completed tasks!');
        });

        await test.step('6. Validate that the task list is empty, displaying the message “No tasks found!”', async() => {
            await expect(tasks).toHaveCount(0);
            await expect(message).toHaveText('No tasks found!');
        });

    });

    test('Test Case 04 - Search and Filter Functionality in todo App', async({ page }) => {

        const todoTasks = [ 'clean', 'workout', 'cook', 'study', 'call mom' ];

        const tasks = page.locator('#panel .panel-block div');

        await test.step('2. Enter and add 5 to-do items individually', async() => {
            for(const task of todoTasks) {
                await typeText(page, 'New todo', task);
                await clickButton(page, 'ADD');
            }
        });

        await test.step('3. Validate that all added items match the items displayed on the list', async() => {
            const tasksArray = await tasks.all();

            for(let i = 0; i < tasksArray.length; i++) {
                await expect(tasksArray[i]).toHaveText(todoTasks[i]);
            }
        });

        await test.step('4. Enter the complete name of the previously added to-do item into the search bar', async() => {
            await typeText(page, 'Type to search', todoTasks[0]);
        });

        await test.step('5. Validate that the list is now filtered to show only the item you searched for', async() => {
            await expect(tasks).toHaveText(todoTasks[0]);
        });

        await test.step('5. Validate that the number of tasks visible in the list is exactly one', async() => {
            await expect(tasks).toHaveCount(1);
        });
    });

    test('Test Case 05 - Task Validation and Error Handling', async({ page }) => {
        const invalidTask = 'Stop procrastinating and get to work!'
        const validTask = 'Do groceries';
        
        const tasks = page.locator('#panel .panel-block div');
        const message = page.locator('.has-text-danger');
        const errorMessage = page.locator('.is-danger');

        await test.step('2. Attempt to add an empty task to the to-do list', async() => {
            await clickButton(page, 'ADD');
        });

        await test.step('3. Validate that the task list is empty, displaying the message “No task found!”', async() => {
            await expect(tasks).toHaveCount(0);
            await expect(message).toHaveText('No tasks found!');
        });

        await test.step('4. Enter an item name exceeding 30 characters into the list', async() => {
            await typeText(page, 'New todo', invalidTask);
            await clickButton(page, 'ADD');
        });

        await test.step('5. Validate error message appears and says “Error: Todo cannot be more than 30 characters!”', async() => {
            expect(errorMessage).toHaveText('Error: Todo cannot be more than 30 characters!');
        });

        await test.step('6. Add a valid item name to the list', async() => {
            await typeText(page, 'New todo', validTask);
            await clickButton(page, 'ADD');
        });

        await test.step('7. Validate that the active task count is exactly one', async() => {
            await expect(tasks).toHaveCount(1);
        });

        await test.step('8. Try to enter an item with the same name already present on the list', async() => {
            await typeText(page, 'New todo', validTask);
            await clickButton(page, 'ADD');
        });

        await test.step('9. Validate that an error message is displayed, indicating “Error: You already have {ITEM} in your todo list.”', async() => {
            expect(errorMessage).toHaveText(`Error: You already have ${validTask} in your todo list.`);
        });
    });
});