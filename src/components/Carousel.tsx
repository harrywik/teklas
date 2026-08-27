import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';

interface ImageData {
	src: string;
	alt: string;
}

interface CarouselProps {
	images: ImageData[];
}

export default function Carousel({ images }: CarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const totalImages = images.length;

	const goToPrevious = () => {
		setCurrentIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
	};

	const goToNext = () => {
		setCurrentIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
	};

	const toggleFullscreen = () => {
		setIsFullscreen(!isFullscreen);
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isFullscreen) return;
			if (e.key === 'Escape') toggleFullscreen();
			if (e.key === 'ArrowLeft') goToPrevious();
			if (e.key === 'ArrowRight') goToNext();
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isFullscreen]);

	useEffect(() => {
		if (isFullscreen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [isFullscreen]);

	return (
		<>
			<div className="relative w-full rounded-2xl overflow-hidden shadow-2xl my-8 group" style={{ aspectRatio: '16/9' }}>
				{/* Blurred background */}
				<div className="absolute inset-0 -z-10">
					<div className="absolute inset-0 bg-black/20 backdrop-blur-2xl scale-110" />
				</div>

				{/* Image slides */}
				{images.map((image, index) => (
					<div
						key={index}
						className={`absolute inset-0 flex items-center justify-center p-8 overflow-hidden transition-all duration-500 ${
							index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
						}`}
						style={{ display: index === currentIndex ? 'flex' : 'none' }}
					>
						<img
							src={image.src}
							alt={image.alt}
							className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
						/>
					</div>
				))}

				{/* Fullscreen button */}
				<button
					onClick={toggleFullscreen}
					className="absolute top-4 right-4 bg-white/90 hover:bg-white text-dark w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-20 cursor-pointer"
					aria-label="Visa i helskärm"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<polyline points="15 3 21 3 21 9" />
						<polyline points="9 21 3 21 3 15" />
						<line x1="21" y1="3" x2="14" y2="10" />
						<line x1="3" y1="21" x2="10" y2="14" />
					</svg>
				</button>

				{/* Navigation buttons */}
				<button
					onClick={goToPrevious}
					className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-dark w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer z-20"
					aria-label="Föregående bild"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<polyline points="15 18 9 12 15 6" />
					</svg>
				</button>

				<button
					onClick={goToNext}
					className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-dark w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer z-20"
					aria-label="Nästa bild"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<polyline points="9 18 15 12 9 6" />
					</svg>
				</button>

				{/* Dots indicator */}
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
					{images.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentIndex(index)}
							className={`h-2 rounded-full transition-all cursor-pointer ${
								index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75 w-2'
							}`}
							aria-label={`Gå till bild ${index + 1}`}
						/>
					))}
				</div>
			</div>

			{/* Fullscreen portal */}
			{isFullscreen && typeof window !== 'undefined' && createPortal(
				<div className="fixed inset-0 z-[9999] bg-black/95">
					<button
						onClick={toggleFullscreen}
						className="absolute top-6 right-6 bg-white/90 hover:bg-white text-dark w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all z-50 cursor-pointer"
						aria-label="Stäng helskärm"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>

					<button
						onClick={goToPrevious}
						className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-dark w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all cursor-pointer z-50"
						aria-label="Föregående bild"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<polyline points="15 18 9 12 15 6" />
						</svg>
					</button>

					<button
						onClick={goToNext}
						className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-dark w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all cursor-pointer z-50"
						aria-label="Nästa bild"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<polyline points="9 18 15 12 9 6" />
						</svg>
					</button>

					<div className="relative w-full h-full">
						{images.map((image, index) => (
							<div
								key={index}
								className={`absolute inset-0 flex items-center justify-center p-8 overflow-hidden transition-all duration-500 ${
									index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
								}`}
								style={{ display: index === currentIndex ? 'flex' : 'none' }}
							>
								<img
									src={image.src}
									alt={image.alt}
									className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
								/>
							</div>
						))}
					</div>

					<div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50">
						{images.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentIndex(index)}
								className={`h-2 rounded-full transition-all cursor-pointer ${
									index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75 w-2'
								}`}
								aria-label={`Gå till bild ${index + 1}`}
							/>
						))}
					</div>
				</div>,
				document.body
			)}
		</>
	);
}
