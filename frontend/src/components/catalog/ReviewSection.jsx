import { Send, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useRequireAuthAction } from '../../hooks/useRequireAuthAction.js';
import { reviewService } from '../../services/reviewService.js';
import StarRating from './StarRating.jsx';

export default function ReviewSection({ productId, onReviewSaved }) {
  const { user } = useSelector((state) => state.auth);
  const requireAuthAction = useRequireAuthAction();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const loadReviews = () => {
    reviewService.getReviews(productId)
      .then(setReviews)
      .catch(() => toast.error('Could not load reviews'));
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const submitReview = (values) => requireAuthAction(async () => {
    try {
      await reviewService.saveReview({
        productId: Number(productId),
        rating,
        comment: values.comment,
      });
      reset();
      toast.success('Review saved');
      loadReviews();
      onReviewSaved?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not save review');
    }
  });

  return (
    <section className="mt-12 border-t border-slate-200 pt-10 dark:border-slate-800">
      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <form className="h-fit rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900" onSubmit={handleSubmit(submitReview)}>
          <h2 className="text-2xl font-black">Write a review</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {user ? 'Share how this product worked for you.' : 'Sign in to leave a review.'}
          </p>

          <div className="mt-5 flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => {
              const value = index + 1;
              return (
                <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} stars`}>
                  <Star size={26} className={value <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'} />
                </button>
              );
            })}
          </div>

          <label className="mt-5 grid gap-2 text-sm font-semibold">
            Comment
            <textarea className="input min-h-32" {...register('comment', { required: 'Comment is required', minLength: { value: 3, message: 'Use at least 3 characters' } })} />
            {errors.comment && <span className="text-sm text-rose-500">{errors.comment.message}</span>}
          </label>

          <button className="btn-primary mt-5 w-full">
            <Send size={18} /> Submit review
          </button>
        </form>

        <div>
          <h2 className="text-2xl font-black">Customer Reviews</h2>
          <div className="mt-5 grid gap-4">
            {reviews.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
                No reviews yet.
              </div>
            ) : (
              reviews.map((review) => (
                <article key={review.id} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <div className="font-black">{review.userName}</div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <StarRating rating={review.rating} count={0} />
                  </div>
                  <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">{review.comment}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
