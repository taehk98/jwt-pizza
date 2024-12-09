import { sleep, check, group, fail } from 'k6'
import http from 'k6/http'

export const options = {
  cloud: {
    distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    Scenario_1: {
      executor: 'ramping-vus',
      gracefulStop: '30s',
      stages: [
        { target: 5, duration: '30s' },
        { target: 15, duration: '1m' },
        { target: 10, duration: '30s' },
        { target: 0, duration: '30s' },
      ],
      gracefulRampDown: '30s',
      exec: 'scenario_1',
    },
  },
}

export function scenario_1() {
  let response

  group('page_1 - https://pizza.sportsday.click/', function () {
    response = http.get('https://pizza.sportsday.click/', {
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'cache-control': 'max-age=0',
        'if-modified-since': 'Tue, 29 Oct 2024 05:49:09 GMT',
        'if-none-match': '"bcbf3ccd37c65627437b5a79c2fe4071"',
        priority: 'u=0, i',
        'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
      },
    })
    sleep(5.4)
    const vars = {};
    response = http.put(
      'https://pizza-service.sportsday.click/api/auth',
      '{"email":"a@gmail.com","password":"1234"}',
      {
        headers: {
          accept: '*/*',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
          'content-type': 'application/json',
          origin: 'https://pizza.sportsday.click',
          priority: 'u=1, i',
          'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        },
      }
    )
    if (!check(response, { 'status equals 200': response => response.status.toString() === '200' })) {
      console.log(response.body);
      fail('Login was *not* 200');
    }
    vars['token1'] = jsonpath.query(response.json(), '$.token')[0];
    sleep(1.8)

    response = http.get('https://pizza-service.sportsday.click/api/order/menu', {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'content-type': 'application/json',
        'if-none-match': 'W/"3f8-Ie5TQl703DstdLfLArR1NiNP++U"',
        origin: 'https://pizza.sportsday.click',
        priority: 'u=1, i',
        'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        authorization: `Bearer ${vars['token1']}`,
      },
    })

    response = http.get('https://pizza-service.sportsday.click/api/franchise', {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'content-type': 'application/json',
        'if-none-match': 'W/"56-Fy3Hb9J2d/ANDBMVG44AQp8cSV0"',
        origin: 'https://pizza.sportsday.click',
        priority: 'u=1, i',
        'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        authorization: `Bearer ${vars['token1']}`,
      },
    })
    sleep(3)

    response = http.post(
      'https://pizza-service.sportsday.click/api/order',
      '{"items":[{"menuId":1,"description":"Veggie","price":0.0038}],"storeId":"1","franchiseId":1}',
      {
        headers: {
          accept: '*/*',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
          'content-type': 'application/json',
          origin: 'https://pizza.sportsday.click',
          priority: 'u=1, i',
          'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          authorization: `Bearer ${vars['token1']}`,
        },
      }
    )
    sleep(1.3)

    response = http.post(
      'https://pizza-factory.cs329.click/api/order/verify',
      '{"jwt":"eyJpYXQiOjE3MzI1OTE1MzksImV4cCI6MTczMjY3NzkzOSwiaXNzIjoiY3MzMjkuY2xpY2siLCJhbGciOiJSUzI1NiIsImtpZCI6IjE0bk5YT21jaWt6emlWZWNIcWE1UmMzOENPM1BVSmJuT2MzazJJdEtDZlEifQ.eyJ2ZW5kb3IiOnsiaWQiOiJ0YWVob29uNyIsIm5hbWUiOiJUYWVob29uIEtpbSJ9LCJkaW5lciI6eyJpZCI6MTAsIm5hbWUiOiJUYWVob29uIiwiZW1haWwiOiJhQGdtYWlsLmNvbSJ9LCJvcmRlciI6eyJpdGVtcyI6W3sibWVudUlkIjoxLCJkZXNjcmlwdGlvbiI6IlZlZ2dpZSIsInByaWNlIjowLjAwMzh9XSwic3RvcmVJZCI6IjEiLCJmcmFuY2hpc2VJZCI6MSwiaWQiOjE0fX0.SBDfKzirgmPiPW_ICHOTTiAbeix0uwO_RwC2imwqwcaOUnGFBKCcZusndQcgDIuV5-GbHGJ_3mdMdhZ3PZdmBG4HW8yscgQqvtRlO3VDibehopUJ7OFQCvVPOXjpDBGS4VhPD277XaVGRyjkX0jbELn7mw4NhKaMNO_Vw6Dxyjr_FS6ZOXln-IAEKitGCfB74UrTIeEoJBRV0hK128hXG3IokUtYqFUjmlBDw_ENNqevx6NA3aqkf-0r3DHa1lbPql2-vowpg22DNvk0jWFtL7HKypK3e-dF35WE5YO5ypkviwZu1SkWZUnFGaWT6ASNh0DzkPPYBDCF1u1Ke_fHoeUJMX11LbC2jI4M6uv3v59zmXshfzIa_7ysNJUTGrdFMMsiEGl7z5GZd-AKOFnafbqT7wYa_FRS0i72b-rZIRz6kDgIT-tcFAl5xKVUNXqFNL191_exVp6RbYgpll-IY9mh5QQhtCuKnRx0sbNkSm_y9HkPrgfgEkxOf43QejVwg0CfeOeQT0c-3rztWcwtOKKIYBiVCir67xrxA-vtuUXkZv1xC-qFk1l4BLmNtU8X1tfMTsjT9VwQ8LN5DAatQo_-BNbYpBoEUmb3zKyEk68Sp4_amBN1x4FR8tMuCyWYGjHHvVj17HIQoUsPLm_ksbVtlDkuNvTYlJ-r7A-dpGo"}',
      {
        headers: {
          accept: '*/*',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
          'content-type': 'application/json',
          origin: 'https://pizza.sportsday.click',
          priority: 'u=1, i',
          'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
          authorization: `Bearer ${vars['token1']}`,
        },
      }
    )
  })
}