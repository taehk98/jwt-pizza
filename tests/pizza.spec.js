import { test, expect } from 'playwright-test-coverage';

test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});

test('test register', async ({ page }) => {
  await page.goto('/');

  await page.route('*/**/api/auth', async (route) => {
    const registerReq = { name: "Taehoon", email: 'kthsh98@gmail.com', password: 'a' };
    const registerRes = { user: { id: 3, name: 'Taehoon', email: 'kthsh98@gmail.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('POST');
    await route.fulfill({ json: registerRes });
  });

  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByPlaceholder('Full name').fill('Taehoon');
  await page.getByPlaceholder('Full name').press('Tab');
  await page.getByPlaceholder('Email address').fill('kthsh98@gmail.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page.locator('h2')).toContainText("The web's best pizza");
  await expect(page.locator('main')).toContainText("Pizza is an absolute delight that brings joy to people of all ages. The perfect combination of crispy crust, savory sauce, and gooey cheese makes pizza an irresistible treat. At JWT Pizza, we take pride in serving the web's best pizza, crafted with love and passion. Our skilled chefs use only the finest ingredients to create mouthwatering pizzas that will leave you craving for more. Whether you prefer classic flavors or adventurous toppings, our diverse menu has something for everyone. So why wait? Indulge in the pizza experience of a lifetime and visit JWT Pizza today!");
  await expect(page.locator('main')).toContainText("Pizza has come a long way since its humble beginnings. From its origins in Italy to becoming a global sensation, pizza has captured the hearts and taste buds of people worldwide. It has become a symbol of comfort, celebration, and togetherness. At JWT Pizza, we understand the magic of pizza and strive to deliver an unforgettable dining experience. Our cozy ambiance, friendly staff, and delectable pizzas create the perfect setting for a memorable meal. Whether you're dining with family, friends, or enjoying a solo pizza night, Pizza Shop is the place to be.");
});

// test('buy pizza', async ({ page }) => {
//   await page.goto('/');
//   await page.getByRole('link', { name: 'Order' }).click();

//   await page.getByRole('link', { name: 'Image Description Margarita' }).click();
//   await page.getByRole('link', { name: 'Image Description Crusty A' }).click();
//   await page.getByRole('link', { name: 'Image Description Flat' }).click();
//   await page.getByRole('link', { name: 'Image Description Chared' }).click();
//   await page.getByRole('link', { name: 'Image Description Sandpaper' }).click();
//   await page.getByText('Selected pizzas:').click();
//   await page.getByRole('combobox').selectOption('2');
//   await page.getByRole('button', { name: 'Checkout' }).click();
//   await page.getByPlaceholder('Email address').click();
//   await page.getByPlaceholder('Email address').fill('d@jwt.com');
//   await page.getByPlaceholder('Password').click();
//   await page.getByPlaceholder('Password').fill('a');
//   await page.getByRole('button', { name: 'Login' }).click();
// });

test('purchase with login', async ({ page }) => {
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
      { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: 'LotaPizza',
        stores: [
          { id: 4, name: 'Lehi' },
          { id: 5, name: 'Springville' },
          { id: 6, name: 'American Fork' },
        ],
      },
      { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
      { id: 4, name: 'topSpot', stores: [] },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'd@jwt.com', password: 'a' };
    const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/order', async (route) => {
    const orderReq = {
      items: [
        { menuId: 1, description: 'Veggie', price: 0.0038 },
        { menuId: 2, description: 'Pepperoni', price: 0.0042 },
      ],
      storeId: '4',
      franchiseId: 2,
    };
    const orderRes = {
      order: {
        items: [
          { menuId: 1, description: 'Veggie', price: 0.0038 },
          { menuId: 2, description: 'Pepperoni', price: 0.0042 },
        ],
        storeId: '4',
        franchiseId: 2,
        id: 23,
      },
      jwt: 'eyJpYXQ',
    };
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });

  await page.goto('/');

  // Go to order page
  await page.getByRole('button', { name: 'Order now' }).click();

  // Create order
  await expect(page.locator('h2')).toContainText('Awesome is a click away');
  await page.getByRole('combobox').selectOption('4');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await expect(page.locator('form')).toContainText('Selected pizzas: 2');
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Login
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  // Pay
  await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
  await expect(page.locator('tbody')).toContainText('Veggie');
  await expect(page.locator('tbody')).toContainText('Pepperoni');
  await expect(page.locator('tfoot')).toContainText('0.008 ₿');
  await page.getByRole('button', { name: 'Pay now' }).click();

  // Check balance
  await expect(page.getByText('0.008')).toBeVisible();
});

test('register', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    const registerReq = { name: "Taehoon", email: 'kthsh98@gmail.com', password: 'a' };
    const registerRes = { user: { id: 3, name: 'Taehoon', email: 'kthsh98@gmail.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON().user["name"]).toBe('Taehoon');
    expect(route.request().postDataJSON().user["email"]).toBe('kthsh@gmail.com');
    expect(route.request().postDataJSON().token).toBeDefined();
    await route.fulfill({ json: registerRes });
  });
});

test('francise Dashboard', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByRole('main')).toContainText('So you want a piece of the pie?');
  await page.locator('div').filter({ hasText: /^If you are already a franchisee, pleaseloginusing your franchise account$/ }).nth(1).click();
  await expect(page.getByRole('main')).toContainText('Call now800-555-5555');
  await expect(page.getByRole('main')).toContainText('Now is the time to get in on the JWT Pizza tsunami. The pizza sells itself. People cannot get enough. Setup your shop and let the pizza fly. Here are all the reasons why you should buy a franchise with JWT Pizza.');
  await expect(page.getByRole('main')).toContainText('Owning a franchise with JWT Pizza can be highly profitable. With our proven business model and strong brand recognition, you can expect to generate significant revenue. Our profit forecasts show consistent growth year after year, making it a lucrative investment opportunity.');
  await expect(page.getByRole('main')).toContainText('In addition to financial success, owning a franchise also allows you to make a positive impact on your community. By providing delicious pizzas and creating job opportunities, you contribute to the local economy and bring joy to people\'s lives. It\'s a rewarding experience that combines entrepreneurship with social responsibility. The following table shows a possible stream of income from your franchise.');
  await expect(page.getByRole('main')).toContainText('But it\'s not just about the money. By becoming a franchise owner, you become part of a community that is passionate about delivering exceptional pizzas and creating memorable experiences. You\'ll have the chance to build a team of dedicated employees who share your vision and work together to achieve greatness. And as your business grows, so does your impact on the local economy, creating jobs and bringing joy to countless pizza lovers.');
  await expect(page.getByRole('main').locator('img')).toBeVisible();
  await expect(page.locator('.bg-neutral-100')).toBeVisible();
  await expect(page.getByRole('main')).toContainText('Unleash Your Potential');
  await expect(page.getByRole('main')).toContainText('Are you ready to embark on a journey towards unimaginable wealth? Owning a franchise with JWT Pizza is your ticket to financial success. With our proven business model and strong brand recognition, you have the opportunity to generate substantial revenue. Imagine the thrill of watching your profits soar year after year, as customers flock to your JWT Pizza, craving our mouthwatering creations.');
  await expect(page.getByText('FranchiseAboutHistory')).toBeVisible();
});

test('logout', async ({ page }) => {
  await page.goto('/');

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'd@jwt.com', password: 'a' };
    const loginRes = {
      user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] },
      token: 'abcdef'
    };
    if (route.request().method() === 'PUT') {
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    } else if (route.request().method() === 'DELETE') {
      await route.fulfill({ status: 200 });
    }
  });

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
});

test('verify order', async ({ page }) => {
  await page.goto('/');

  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
      { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: 'LotaPizza',
        stores: [
          { id: 4, name: 'Lehi' },
          { id: 5, name: 'Springville' },
          { id: 6, name: 'American Fork' },
        ],
      },
      { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
      { id: 4, name: 'topSpot', stores: [] },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'd@jwt.com', password: 'a' };
    const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/order', async (route) => {
    const orderReq = {
      items: [
        { menuId: 1, description: 'Veggie', price: 0.0038 },
      ],
      storeId: '4',
      franchiseId: 2,
    };
    const orderRes = {
      order: {
        items: [
          { menuId: 1, description: 'Veggie', price: 0.0038 },
        ],
        storeId: '4',
        franchiseId: 2,
        id: 23,
      },
      jwt: 'eyJpYXQ',
    };
  
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Order now' }).click();
  await page.getByRole('combobox').selectOption('1');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await expect(page.locator('form')).toContainText('Selected pizzas: 1');
  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page.getByRole('button', { name: 'Pay now' })).toBeVisible();
  await expect(page.getByText('Send me that pizza right now!')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await page.getByRole('button', { name: 'Pay now' }).click();
  await expect(page.getByRole('button', { name: 'Verify' })).toBeVisible();
  await expect(page.getByRole('main').getByRole('img')).toBeVisible();
  await page.getByRole('button', { name: 'Verify' }).click();
  await expect(page.getByRole('heading', { name: 'JWT Pizza' })).toBeVisible();
});
});

test('test dinerDashboard', async ({ page }) => {
  await page.goto('/');

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'd@jwt.com', password: 'a' };
    const loginRes = {
      user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'admin' }] },
      token: 'abcdef'
    };
    if (route.request().method() === 'PUT') {
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    }
  });
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'KC' }).click();
  await expect(page.getByText('Your pizza kitchen')).toBeVisible();
  await expect(page.getByRole('img', { name: 'Employee stock photo' })).toBeVisible();
  await expect(page.getByText('name:')).toBeVisible();
  await expect(page.getByText('Kai Chen')).toBeVisible();
  await expect(page.getByText('email:')).toBeVisible();
  await expect(page.getByText('d@jwt.com')).toBeVisible();
  await expect(page.getByText('role:')).toBeVisible();
  await expect(page.getByText('admin', { exact: true })).toBeVisible();
  await expect(page.getByText('How have you lived this long')).toBeVisible();
});


test('test adminDashboard and franchise', async ({ page }) => {
  await page.goto('/');

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'd@jwt.com', password: 'a' };
    const loginRes = {
      user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'admin' }] },
      token: 'abcdef'
    };
    if (route.request().method() === 'PUT') {
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    } else if (route.request().method() === 'DELETE') {
      await route.fulfill({ status: 200 });
    }
  });

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'Admin' }).click();

  await expect(page.getByRole('main')).toContainText("Mama Ricci's kitchen");
  await expect(page.getByRole('main')).toContainText('Keep the dough rolling and the franchises signing up.')
  await expect(page.getByRole('button', { name: 'Add Franchise' })).toBeVisible();
  page.getByRole('button', { name: 'Add Franchise' }).click();

  const franchiseRes = [
    {
      id: 2,
      name: 'LotaPizza',
      stores: [
        { id: 4, name: 'Lehi', totalRevenue: 1000 },
        { id: 5, name: 'Springville', totalRevenue: 1000 },
        { id: 6, name: 'American Fork', totalRevenue: 1000 },
      ],
      admins: [{ id: 3, name: 'Kai Chen' }],
    },
    { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork', totalRevenue: 1000 }], admins: [{ id: 3, name: 'Kai Chen' }], },
    { id: 4, name: 'topSpot', stores: [], admins: [{ id: 3, name: 'Kai Chen' }], },
  ];

  await page.route('*/**/api/franchise', async (route) => {
    if (route.request().method() === 'GET') {
      expect(route.request().method()).toBe('GET');
      await route.fulfill({ json: franchiseRes });
    } else if (route.request().method() === 'POST') {
      expect(route.request().method()).toBe('POST');
      await route.fulfill({ json: franchiseRes });
    } else if (route.request().method() === 'DELETE') {
      await route.fulfill({ status: 200});
    }
  });

  await expect(page.getByRole('main')).toContainText("Create franchise");
  await expect(page.getByRole('main')).toContainText("Want to create franchise?");
  await expect(page.getByPlaceholder('franchise name')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await page.getByPlaceholder('franchise name').click();
  await page.getByPlaceholder('franchise name').fill('LotaPizza');
  await page.getByPlaceholder('franchisee admin email').click();
  await page.getByPlaceholder('franchisee admin email').fill('admin@jwt.com');

  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('cell', { name: 'LotaPizza' })).toBeVisible();
  await expect(page.getByText('Keep the dough rolling and')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Kai Chen' }).first()).toBeVisible();
  await expect(page.getByRole('row', { name: 'LotaPizza Kai Chen Close' }).getByRole('button')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'PizzaCorp' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'topSpot' })).toBeVisible();
  await expect(page.getByText('Mama Ricci\'s kitchen')).toBeVisible();
  await page.getByRole('row', { name: 'topSpot Kai Chen Close' }).getByRole('button').click();
  await expect(page.getByText('Sorry to see you go')).toBeVisible();
  await expect(page.getByText('Are you sure you want to')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();

  await page.getByRole('button', { name: 'Close' }).click();
});

test('test not found', async ({ page }) => {
  await page.goto('/random');

  await expect(page.locator('main')).toContainText('It looks like we have dropped a pizza on the floor. Please try another page.');
});

test('test history', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'History' })).toBeVisible();
  await page.getByRole('link', { name: 'History' }).click();
  await expect(page.getByText('Mama Rucci, my my')).toBeVisible();
  await expect(page.getByText('It all started in Mama Ricci\'')).toBeVisible();
  
  await expect(page.getByText('Pizza has a long and rich')).toBeVisible();
  await expect(page.getByText('However, it was the Romans')).toBeVisible();
  await expect(page.getByText('Fast forward to the 18th')).toBeVisible();
  await expect(page.getByText('It gained popularity in')).toBeVisible();
  await expect(page.getByRole('main').getByRole('img')).toBeVisible();
});

test('test about', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page.getByText('The secret sauce')).toBeVisible();
  await expect(page.getByText('At JWT Pizza, our amazing')).toBeVisible();
  await expect(page.getByText('Our talented employees at JWT')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Our employees' })).toBeVisible();
  await expect(page.getByText('JWT Pizza is home to a team')).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^James$/ }).getByRole('img')).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Maria$/ }).getByRole('img')).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Anna$/ }).getByRole('img')).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Brian$/ }).getByRole('img')).toBeVisible();
  await expect(page.getByText('At JWT Pizza, our employees')).toBeVisible();
  await expect(page.getByRole('main').getByRole('img').first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'about', exact: true })).toBeVisible();
});

test('test docs', async ({ page }) => {
  await page.goto('/docs/factory');
  await expect(page.getByText('JWT Pizza API')).toBeVisible();
  await expect(page.getByRole('heading', { name: '🔐 [POST] /api/order', exact: true })).toBeVisible();
  await expect(page.getByText('Create a JWT pizza')).toBeVisible();
  await expect(page.getByText('curl -X POST $host/api/order -H \'authorization: Bearer xyz\' -d \'{"diner":{"id":')).toBeVisible();
  await expect(page.locator('label').first()).toBeVisible();
  await expect(page.locator('div:nth-child(4) > .font-bold').first()).toBeVisible();
  await expect(page.getByText('{ "jwt": "JWT here" }')).toBeVisible();
  await expect(page.getByRole('heading', { name: '🔐 [POST] /api/order/verify' })).toBeVisible();
  await expect(page.getByText('Verifies a pizza order')).toBeVisible();
  await expect(page.getByText('Example requestcurl -X POST $host/api/order/verify -d \'{"jwt":"JWT here"}\' -H \'')).toBeVisible();
  await expect(page.getByText('Response{ "message": "valid')).toBeVisible();
  await expect(page.getByRole('heading', { name: '[GET] /.well-known/jwks.json' })).toBeVisible();
  await expect(page.getByText('Get the JSON Web Key Set (')).toBeVisible();
  await expect(page.getByText('Example requestcurl -X POST $host/.well-known/jwks.json')).toBeVisible();
  await expect(page.getByText('Response{ "keys": [ { "kty')).toBeVisible();
  await expect(page.getByRole('heading', { name: '🔐 [POST] /api/vendor' })).toBeVisible();
  await expect(page.getByText('Add a new vendor')).toBeVisible();
  await expect(page.getByText('Example requestcurl -X POST $host/api/admin/vendor -H \'authorization: Bearer')).toBeVisible();
  await expect(page.getByText('Response{ "apiKey": "abcxyz')).toBeVisible();
  await expect(page.getByRole('heading', { name: '🔐 [PUT] /api/vendor/:' })).toBeVisible();
  await expect(page.getByText('Updates a vendor. Only supply')).toBeVisible();
  await expect(page.getByText('Example requestcurl -X POST $host/api/admin/vendor/111111 -H \'authorization:')).toBeVisible();
  await expect(page.getByText('Response{ "vendor": { "id": "')).toBeVisible();
  await expect(page.getByRole('heading', { name: '[GET] /api/support/:' })).toBeVisible();
  await expect(page.getByText('Report a problem')).toBeVisible();
  await expect(page.getByText('Example requestcurl -X POST $host/api/support/abcxyz/report/')).toBeVisible();
  await expect(page.getByText('Response{ "message": "ticket')).toBeVisible();
});
