import React from 'react';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  productName: string;
  date: string;
}

export function ReviewsView() {
  const reviews: Review[] = [
    {
      id: 'r1',
      customerName: 'Nimal Jayasinghe',
      rating: 5,
      comment: 'Excellent Ceylon cinnamon! Very fresh and fragrant. Highly recommend this seller.',
      productName: 'Organic Ceylon Cinnamon Quills',
      date: 'July 28, 2026',
    },
    {
      id: 'r2',
      customerName: 'Dilhani Rodrigo',
      rating: 4,
      comment: 'The coconut teacups are absolutely beautiful. Packaged very carefully. Delivery took 3 days to Kandy.',
      productName: 'Handcrafted Coconut Shell Teacup Set',
      date: 'July 24, 2026',
    },
    {
      id: 'r3',
      customerName: 'Suresh Perera',
      rating: 5,
      comment: 'Premium grade products. Fast response from the vendor when I asked about shipping details.',
      productName: 'Organic Ceylon Cinnamon Quills',
      date: 'July 15, 2026',
    },
  ];

  const ratingSummary = {
    average: 4.7,
    totalCount: 14,
    stars: [
      { star: 5, count: 11, percentage: 78 },
      { star: 4, count: 2, percentage: 14 },
      { star: 3, count: 1, percentage: 8 },
      { star: 2, count: 0, percentage: 0 },
      { star: 1, count: 0, percentage: 0 },
    ],
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Review Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Card */}
        <div className="card p-6 flex flex-col items-center justify-center text-center">
          <span className="text-sm font-semibold text-[var(--sonic-silver)] uppercase tracking-wider mb-2">
            Average Rating
          </span>
          <h2 className="text-5xl font-bold text-[var(--eerie-black)] tracking-tight">
            {ratingSummary.average}
          </h2>
          <div className="flex gap-1 my-2 text-xl text-yellow-500">
            {Array.from({ length: 5 }).map((_, idx) => (
              <span key={idx}>{idx < Math.round(ratingSummary.average) ? '★' : '☆'}</span>
            ))}
          </div>
          <span className="text-xs text-[var(--sonic-silver)] font-medium">
            Based on {ratingSummary.totalCount} customer ratings
          </span>
        </div>

        {/* Breakdown Card */}
        <div className="card p-6 md:col-span-2 space-y-3">
          <h4 className="font-bold text-sm text-[var(--eerie-black)] uppercase tracking-wider pb-2 border-b border-[var(--cultured)]">
            Ratings Breakdown
          </h4>
          <div className="space-y-2.5">
            {ratingSummary.stars.map((starItem) => (
              <div key={starItem.star} className="flex items-center gap-3 text-xs font-semibold">
                <span className="w-12 text-[var(--davys-gray)]">{starItem.star} Stars</span>
                <div className="flex-1 h-2 bg-[var(--cultured)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{ width: `${starItem.percentage}%` }}
                  />
                </div>
                <span className="w-14 text-right text-[var(--onyx)]">
                  {starItem.count} ({starItem.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Comments list */}
      <div className="card p-6 space-y-4">
        <h4 className="font-bold text-[var(--eerie-black)] pb-4 border-b border-[var(--cultured)]">
          Recent Customer Feedback
        </h4>

        <div className="space-y-6 divide-y divide-[var(--cultured)]">
          {reviews.map((review, idx) => (
            <div key={review.id} className={`pt-4 first:pt-0 space-y-2`}>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h5 className="font-bold text-[var(--eerie-black)]">{review.customerName}</h5>
                  <p className="text-xs text-[var(--sonic-silver)] mt-0.5">
                    Purchased:{' '}
                    <span className="text-[var(--salmon-pink)] font-semibold">
                      {review.productName}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex gap-0.5 text-sm text-yellow-500 justify-end">
                    {Array.from({ length: 5 }).map((_, sIdx) => (
                      <span key={sIdx}>{sIdx < review.rating ? '★' : '☆'}</span>
                    ))}
                  </div>
                  <span className="text-[10px] text-[var(--spanish-gray)] font-semibold">
                    {review.date}
                  </span>
                </div>
              </div>
              <p className="text-sm text-[var(--davys-gray)] leading-relaxed bg-[var(--cultured)]/20 p-3 rounded-lg border border-[var(--cultured)]/45">
                &ldquo;{review.comment}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
