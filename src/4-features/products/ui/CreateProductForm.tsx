import { FC, KeyboardEvent, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCreateProductMutation, useGetCategoriesQuery } from 'shared/store/api/productsApi';

type CreateProductValues = {
	name: string;
	description: string;
	price: number;
	discount: number;
	stock: number;
	images: string;
	wight: string;
	categoryId: number;
};

const schema = yup.object({
	name: yup.string().required('Введите название'),
	description: yup.string().required('Введите описание'),
	price: yup.number().typeError('Введите число').min(1, 'Цена > 0').required(),
	discount: yup.number().typeError('Введите число').min(0).required(),
	stock: yup.number().typeError('Введите число').min(1, 'Количество > 0').required(),
	images: yup.string().url('Введите корректный URL').required('Введите URL изображения'),
	wight: yup.string().required('Введите вес'),
	categoryId: yup.number().typeError('Выберите категорию').min(1, 'Выберите категорию').required(),
});

const inp = {
	display: 'block',
	width: '100%',
	padding: '10px 14px',
	marginBottom: 4,
	border: '1px solid #cfd8dc',
	borderRadius: 8,
	fontSize: 15,
	fontFamily: 'inherit',
	boxSizing: 'border-box' as const,
};

const lbl = {
	display: 'block',
	marginBottom: 16,
	fontWeight: 600,
	fontSize: 15,
};

const err = { color: '#f44336', fontSize: 13, marginTop: 2, display: 'block' };

export const CreateProductForm: FC = () => {
	const navigate = useNavigate();
	const [createProduct, { isLoading }] = useCreateProductMutation();
	const { data: categories = [] } = useGetCategoriesQuery();

	const [tags, setTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState('');

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateProductValues>({
		resolver: yupResolver(schema),
		defaultValues: { discount: 0, stock: 1, categoryId: 0 },
	});

	const addTag = () => {
		const val = tagInput.trim();
		if (val && !tags.includes(val)) {
			setTags([...tags, val]);
		}
		setTagInput('');
	};

	const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			addTag();
		}
	};

	const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

	const onSubmit: SubmitHandler<CreateProductValues> = async (values) => {
		const response = await createProduct({ ...values, tags, isPublished: true } as unknown as Product);
		if (!response.error) {
			toast.success('Товар создан!');
			navigate('/');
		} else {
			toast.error('Не удалось создать товар');
		}
	};

	return (
		<div style={{ maxWidth: 600, margin: '40px auto', paddingBottom: 40 }}>
			<h1 style={{ marginBottom: 24 }}>Создать товар</h1>
			<form onSubmit={handleSubmit(onSubmit)}>

				<label style={lbl}>
					Название
					<input {...register('name')} style={inp} />
					{errors.name && <span style={err}>{errors.name.message}</span>}
				</label>

				<label style={lbl}>
					Описание
					<textarea {...register('description')} style={{ ...inp, minHeight: 80, resize: 'vertical' }} />
					{errors.description && <span style={err}>{errors.description.message}</span>}
				</label>

				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
					<label style={lbl}>
						Цена (₽)
						<input type='number' {...register('price')} style={inp} />
						{errors.price && <span style={err}>{errors.price.message}</span>}
					</label>
					<label style={lbl}>
						Скидка (₽)
						<input type='number' {...register('discount')} style={inp} />
						{errors.discount && <span style={err}>{errors.discount.message}</span>}
					</label>
					<label style={lbl}>
						Остаток на складе
						<input type='number' {...register('stock')} style={inp} />
						{errors.stock && <span style={err}>{errors.stock.message}</span>}
					</label>
					<label style={lbl}>
						Вес
						<input {...register('wight')} style={inp} placeholder='100 гр' />
						{errors.wight && <span style={err}>{errors.wight.message}</span>}
					</label>
				</div>

				<label style={lbl}>
					URL изображения
					<input {...register('images')} style={inp} placeholder='https://...' />
					{errors.images && <span style={err}>{errors.images.message}</span>}
				</label>

				<label style={lbl}>
					Категория
					<select {...register('categoryId', { valueAsNumber: true })} style={{ ...inp, appearance: 'auto' }}>
						<option value={0} disabled>Выберите категорию</option>
						{categories.map((cat) => (
							<option key={cat.id} value={cat.id}>{cat.name}</option>
						))}
					</select>
					{errors.categoryId && <span style={err}>{errors.categoryId.message}</span>}
				</label>

				<label style={lbl}>
					Теги
					<div style={{ display: 'flex', gap: 8 }}>
						<input
							value={tagInput}
							onChange={(e) => setTagInput(e.target.value)}
							onKeyDown={handleTagKeyDown}
							style={{ ...inp, marginBottom: 0, flex: 1 }}
							placeholder='Введите тег и нажмите Enter'
						/>
						<button
							type='button'
							onClick={addTag}
							style={{ padding: '10px 16px', background: '#ffe44d', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
							+ Добавить
						</button>
					</div>
					{tags.length > 0 && (
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
							{tags.map((tag) => (
								<span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: '#e3f2fd', borderRadius: 20, fontSize: 14, fontWeight: 600 }}>
									{tag}
									<button type='button' onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f44336', fontWeight: 800, padding: 0, lineHeight: 1 }}>×</button>
								</span>
							))}
						</div>
					)}
				</label>

				<button
					type='submit'
					disabled={isLoading}
					style={{ marginTop: 8, padding: '12px 32px', background: '#ffe44d', border: 'none', borderRadius: 55, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
					{isLoading ? 'Создание...' : 'Создать товар'}
				</button>
			</form>
		</div>
	);
};
