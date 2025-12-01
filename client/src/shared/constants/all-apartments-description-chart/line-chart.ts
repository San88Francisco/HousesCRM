export const apartmentsData = [
  {
    id: 'apt-1',
    apartmentName: 'вул. Шевченка, 45, кв. 12',
    contracts: [
      {
        id: 'c1-1',
        commencement: '2011-02-01',
        termination: '2013-09-30',
        monthlyPayment: 4130,
        renter: { id: 'r1', firstName: 'Олександр', lastName: 'Коваленко' },
      },
      {
        id: 'c1-2',
        commencement: '2014-02-01',
        termination: '2017-05-31',
        monthlyPayment: 4780,
        renter: { id: 'r2', firstName: 'Марія', lastName: 'Петренко' },
      },
      {
        id: 'c1-3',
        commencement: '2017-10-01',
        termination: '2021-03-31',
        monthlyPayment: 5620,
        renter: { id: 'r3', firstName: 'Дмитро', lastName: 'Сидоренко' },
      },
      {
        id: 'c1-4',
        commencement: '2021-12-01',
        termination: '2024-10-31',
        monthlyPayment: 6450,
        renter: { id: 'r4', firstName: 'Анна', lastName: 'Мельник' },
      },
      {
        id: 'c1-5',
        commencement: '2024-10-31',
        termination: '2025-11-07',
        monthlyPayment: 7400, // було 8000
        renter: { id: 'r5', firstName: 'Ігор', lastName: 'Савчук' },
      },
    ],
  },
  {
    id: 'apt-2',
    apartmentName: 'просп. Перемоги, 78, кв. 5',
    contracts: [
      {
        id: 'c2-1',
        commencement: '2010-05-01',
        termination: '2012-10-31',
        monthlyPayment: 4650, // +640
        renter: { id: 'r6', firstName: 'Іван', lastName: 'Бондаренко' },
      },
      {
        id: 'c2-2',
        commencement: '2013-04-01',
        termination: '2016-02-29',
        monthlyPayment: 5270, // +640
        renter: { id: 'r7', firstName: 'Тетяна', lastName: 'Кравченко' },
      },
      {
        id: 'c2-3',
        commencement: '2016-07-01',
        termination: '2019-12-31',
        monthlyPayment: 5930, // +640
        renter: { id: 'r8', firstName: 'Микола', lastName: 'Левченко' },
      },
      {
        id: 'c2-4',
        commencement: '2020-08-01',
        termination: '2023-07-31',
        monthlyPayment: 7460, // +640
        renter: { id: 'r9', firstName: 'Олена', lastName: 'Федорук' },
      },
      {
        id: 'c2-5',
        commencement: '2024-02-01',
        termination: '2025-11-07',
        monthlyPayment: 8000, // було 7900
        renter: { id: 'r10', firstName: 'Артем', lastName: 'Гнатюк' },
      },
    ],
  },
  {
    id: 'apt-3',
    apartmentName: 'вул. Грушевського, 23, кв. 8',
    contracts: [
      {
        id: 'c3-1',
        commencement: '2012-01-01',
        termination: '2014-08-31',
        monthlyPayment: 4750, // +725
        renter: { id: 'r11', firstName: 'Василь', lastName: 'Ткаченко' },
      },
      {
        id: 'c3-2',
        commencement: '2015-01-01',
        termination: '2017-12-31',
        monthlyPayment: 5005, // +725
        renter: { id: 'r12', firstName: 'Ольга', lastName: 'Лисенко' },
      },
      {
        id: 'c3-3',
        commencement: '2018-07-01',
        termination: '2020-09-30',
        monthlyPayment: 6250, // +725
        renter: { id: 'r13', firstName: 'Петро', lastName: 'Демченко' },
      },
      {
        id: 'c3-4',
        commencement: '2021-02-01',
        termination: '2023-11-30',
        monthlyPayment: 7470, // +725
        renter: { id: 'r14', firstName: 'Ірина', lastName: 'Мельничук' },
      },
      {
        id: 'c3-5',
        commencement: '2024-03-01',
        termination: '2025-11-07',
        monthlyPayment: 7900, // було 8000
        renter: { id: 'r15', firstName: 'Ганна', lastName: 'Чорна' },
      },
    ],
  },
  {
    id: 'apt-4',
    apartmentName: 'вул. Незалежності, 14, кв. 4',
    contracts: [
      {
        id: 'c4-1',
        commencement: '2010-06-01',
        termination: '2014-05-31',
        monthlyPayment: 4920, // +780
        renter: { id: 'r16', firstName: 'Роман', lastName: 'Іваненко' },
      },
      {
        id: 'c4-2',
        commencement: '2014-09-01',
        termination: '2018-03-31',
        monthlyPayment: 5350, // +780
        renter: { id: 'r17', firstName: 'Світлана', lastName: 'Тарасюк' },
      },
      {
        id: 'c4-3',
        commencement: '2018-05-01',
        termination: '2021-10-31',
        monthlyPayment: 6690, // +780
        renter: { id: 'r18', firstName: 'Юрій', lastName: 'Гордієнко' },
      },
      {
        id: 'c4-4',
        commencement: '2022-07-01',
        termination: '2024-12-31',
        monthlyPayment: 7220,
        renter: { id: 'r19', firstName: 'Валентина', lastName: 'Капран' },
      },
      {
        id: 'c4-5',
        commencement: '2025-02-01',
        termination: '2025-11-07',
        monthlyPayment: 6800, // було 7990
        renter: { id: 'r20', firstName: 'Євген', lastName: 'Романюк' },
      },
    ],
  },
];
