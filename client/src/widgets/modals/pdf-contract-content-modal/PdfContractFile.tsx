import { FC } from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import {
  PDF_PLACEHOLDER,
  combinePipLine,
  combinePropertyAddressLine,
} from '@/shared/utils/pdf-contract-display';
import { PdfContractModel } from '@/types/services/contracts';

Font.register({
  family: 'RobotoMedium',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
});

Font.register({
  family: 'RobotoLight',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

const styles = StyleSheet.create({
  page: { padding: 22, fontFamily: 'RobotoLight', fontSize: 12, lineHeight: 1.4 },
  title: { fontSize: 14, textAlign: 'center', marginBottom: 12, fontFamily: 'RobotoMedium' },
  heading: { fontSize: 14, marginTop: 12, marginBottom: 4, fontFamily: 'RobotoMedium' },
  paragraph: { marginBottom: 6 },
  list: { marginLeft: 12, marginBottom: 6 },
  listItem: { marginBottom: 4 },
  subList: { marginLeft: 12 },
  /**
   * Нижня межа замість textDecoration: у PDFKit підкреслення часто ламається на пробілах/кирилиці;
   * borderBottom дає одну суцільну лінію під усім рядком.
   */
  fieldFilled: {
    fontFamily: 'RobotoLight',
    fontSize: 12,
    lineHeight: 1.4,
    color: '#000000',
    borderBottomWidth: 0.75,
    borderBottomColor: '#000000',
    paddingBottom: 1,
  },
});

const PdfVal = ({ v }: { v: string }) => {
  if (!v || v === PDF_PLACEHOLDER) {
    return <Text>{PDF_PLACEHOLDER}</Text>;
  }
  return <Text style={styles.fieldFilled}>{v}</Text>;
};

interface Props {
  data: PdfContractModel;
}

export const PdfContractFile: FC<Props> = ({ data }) => {
  const { landlord, tenant, property, terms, meters } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>ДОГОВІР ОРЕНДИ ПРИМІЩЕННЯ (КВАРТИРИ)</Text>

        <Text style={styles.paragraph}>м. Рівне</Text>

        <Text style={styles.paragraph}>
          Ми, що нижче підписались П.І.П.{' '}
          <PdfVal v={combinePipLine(landlord.firstName, landlord.lastName)} />
          , паспорт: серія <PdfVal v={landlord.passportSeries} />, №{' '}
          <PdfVal v={landlord.passportNumber} />, виданий <PdfVal v={landlord.passportIssued} />,
          зареєстрований(а): <PdfVal v={landlord.address} />, що іменується надалі
          &quot;ОРЕНДОДАВЕЦЬ&quot;, з однієї сторони, та П.І.П.{' '}
          <PdfVal v={combinePipLine(tenant.firstName, tenant.lastName)} />, паспорт: серія{' '}
          <PdfVal v={tenant.passportSeries} />, № <PdfVal v={tenant.passportNumber} />, виданий{' '}
          <PdfVal v={tenant.passportIssued} />, зареєстрований(а): <PdfVal v={tenant.address} />, що
          іменується надалі &quot;ОРЕНДАР&quot;, з іншої сторони, уклали цей Договір про таке:
        </Text>

        <Text style={styles.heading}>1. ПРЕДМЕТ ДОГОВОРУ</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            1.1. Орендодавець передає Орендарю в тимчасове користування квартиру (офіс), будинок, що
            іменується надалі &quot;ОРЕНДОВАНЕ ПРИМІЩЕННЯ&quot;, яке належить йому на підставі{' '}
            <PdfVal v={property.ownershipDocument} />, що складається з{' '}
            <PdfVal v={property.roomCount} /> кімнат, загальною площею <PdfVal v={property.area} />{' '}
            кв.м., та знаходиться за адресою:{' '}
            <PdfVal
              v={combinePropertyAddressLine(property.street, property.building, property.apartment)}
            />
            .
          </Text>
        </View>

        <Text style={styles.heading}>2. ПРАВА ТА ОБОВ’ЯЗКИ ОРЕНДОДАВЦЯ</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            2.1. Надати приміщення у розпорядження Орендарю відразу після підписання цього договору.
          </Text>
          <Text style={styles.listItem}>
            2.2. Своєчасно вносити плату за комунальні послуги (при відсутності заборгованості
            орендаря) та виконувати інші зобов’язання власника орендованого приміщення.
          </Text>
          <Text style={styles.listItem}>
            2.3. Не відвідувати Об’єкт без попередньої домовленості з Орендарем.
          </Text>
          <Text style={styles.listItem}>
            2.4. Надати Орендарю безплатно право користування загальними приміщеннями й
            устаткуванням, а саме: вестибюлем, сходами і проходами в будинку, сміттєпроводом.
          </Text>
          <Text style={styles.listItem}>
            2.5. Орендодавець підтверджує, що здає в оренду орендоване приміщення нікому не продане,
            не дароване, не закладене, під забороною не знаходиться, в спорі, арешті та під
            забороною нічого немає.
          </Text>
          <View style={styles.subList}>
            <Text style={styles.listItem}>
              2.5.1. При намірі (рішенні) продати приміщення, яке знаходиться у розпорядженні
              орендодавця, він зобов’язаний попередити орендаря не менше ніж за 30 днів.
            </Text>
          </View>
          <Text style={styles.listItem}>
            2.6. Орендодавець підтверджує, що діє на підставі згоди всіх осіб, що мають право
            користування на вказані площі.
          </Text>
        </View>

        <Text style={styles.heading}>3. ПРАВА ТА ОБОВ’ЯЗКИ ОРЕНДАРЯ</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>3.1. Орендар бере на себе такі зобов’язання:</Text>

          <View style={styles.subList}>
            <Text style={styles.listItem}>
              а) утримувати орендоване приміщення, та територію яка прилягає до нього (двір, гараж)
              в порядку, передбаченому санітарно-протиепідемічними нормами;
            </Text>
            <Text style={styles.listItem}>
              б) не здавати в суборенду орендоване приміщення без дозволу Орендодавця, не
              перебудовувати, не проводити ремонт без дозволу згідно Орендодавця;
            </Text>
            <Text style={styles.listItem}>
              в) своєчасно вносити платежі, передбачені даним Договором; не порушувати тишу та
              спокій жителів сусідніх квартир;
            </Text>
            <Text style={styles.listItem}>
              г) по закінченню терміну оренди здати орендоване приміщення і майно в тому стані, в
              якому воно було передано у користування з урахуванням природного зносу.
            </Text>
          </View>

          <Text style={styles.listItem}>
            3.2. Орендар зобов’язується компенсувати вартість ремонту, техніки та меблів при
            пошкодженні з його вини.
          </Text>
          <View style={styles.subList}>
            <Text style={styles.listItem}>3.2.1. Це не поширюється на природній знос.</Text>
          </View>

          <Text style={styles.listItem}>
            3.3. Орендар несе повну матеріальну відповідальність за майно за актом приймання.
          </Text>

          <Text style={styles.listItem}>
            3.4. Допускати орендодавця на огляд приміщення не частіше ніж{' '}
            <PdfVal v={terms.inspectionCount} /> раз на місяць.
          </Text>
        </View>

        <Text style={styles.heading}>4. ПОРЯДОК РОЗРАХУНКІВ</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            4.1. Місячна ставка орендної плати складає <PdfVal v={terms.rentPriceUah} /> грн.
          </Text>
          <Text style={styles.listItem}>
            4.2. В день підписання договору Орендар передає Орендодавцю{' '}
            <PdfVal v={terms.initialPayment} /> грн.
          </Text>
          <Text style={styles.listItem}>
            4.3. Залишена сума на майно — <PdfVal v={terms.depositAmount} /> грн.
          </Text>
          <Text style={styles.listItem}>
            4.4. При пошкодженні майна витрати покриваються із заставної суми.
          </Text>
          <Text style={styles.listItem}>
            4.5. Після закінчення строку дії договору залогова сума може бути повернена Орендарю.
          </Text>
          <Text style={styles.listItem}>
            4.6. Орендар здійснює щомісячну оплату комунальних послуг.
          </Text>
          <Text style={styles.listItem}>4.7. Показники лічильників:</Text>

          <View style={styles.subList}>
            <Text style={styles.listItem}>
              електроенергія: <PdfVal v={meters.electricity} />
            </Text>
            <Text style={styles.listItem}>
              газ: <PdfVal v={meters.gas} />
            </Text>
            <Text style={styles.listItem}>
              холодна вода: <PdfVal v={meters.coldWater} />
            </Text>
            <Text style={styles.listItem}>
              гаряча вода: <PdfVal v={meters.hotWater} />
            </Text>
          </View>

          <Text style={styles.listItem}>
            4.8. Орендна плата проводиться до <PdfVal v={terms.paymentDeadlineDay} /> числа кожного
            місяця.
          </Text>
        </View>

        <Text style={styles.heading}>5. РОЗІРВАННЯ ДОГОВОРУ</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            5.1. Даний договір може бути розірваний з ініціативи кожної зі сторін.
          </Text>
          <Text style={styles.listItem}>5.2. За згодою сторін.</Text>
          <Text style={styles.listItem}>
            5.3. При розірванні — попередити іншу сторону за 30 днів.
          </Text>
          <Text style={styles.listItem}>5.4. Провести взаємні розрахунки.</Text>
        </View>
      </Page>
    </Document>
  );
};
