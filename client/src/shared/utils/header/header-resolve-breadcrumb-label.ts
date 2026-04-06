import { STATIC_LABELS } from '@/shared/constants/header/header-breadcrumb';
import { ROUTES } from '@/shared/routes';
import { useLazyGetHouseByIdQuery } from '@/store/api/houses-api';
import { useLazyGetRenterByIdQuery } from '@/store/api/renters-api';

const HOUSE_SEGMENT = ROUTES.HOUSE.slice(1);
const RENTER_SEGMENT = ROUTES.RENTER.slice(1);

export const resolveBreadcrumbLabel = async (
  segments: string[],
  triggerHouse: ReturnType<typeof useLazyGetHouseByIdQuery>[0],
  triggerRenter: ReturnType<typeof useLazyGetRenterByIdQuery>[0],
) => {
  const fullPath = `/${segments.join('/')}`;
  let label =
    STATIC_LABELS[fullPath] ?? STATIC_LABELS[`/${segments[0]}`] ?? segments[segments.length - 1];

  if (segments[0] === HOUSE_SEGMENT && segments[1]) {
    try {
      const result = await triggerHouse(segments[1]).unwrap();
      if (result?.houseDetail?.apartmentName) {
        label = result.houseDetail.apartmentName;
      }
    } catch (error) {
      console.error('Failed to fetch house name', error);
    }
  }

  if (segments[0] === RENTER_SEGMENT && segments[1]) {
    try {
      const result = await triggerRenter(segments[1]).unwrap();
      if (result?.oneRenterReport?.firstName) {
        label = `${result.oneRenterReport.firstName} ${result.oneRenterReport.lastName}`;
      }
    } catch (error) {
      console.error('Failed to fetch renter name', error);
    }
  }

  return label;
};
