import { HouseToEdit } from '@/types/core/house';

/**
 * Payload для модалки створення/редагування будинку.
 * Якщо house присутній — режим редагування, інакше — буде створення.
 */

export type HouseModalPayload = {
  house?: HouseToEdit;
};
