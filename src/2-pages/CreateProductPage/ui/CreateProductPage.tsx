import { FC } from 'react';
import { WithProtection } from 'shared/store/HOCs/WithProtection';
import { CreateProductForm } from 'features/products';

export const CreateProductPage: FC = WithProtection(() => {
	return <CreateProductForm />;
});
