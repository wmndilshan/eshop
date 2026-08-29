'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getReviews, getReviewSummary } from '@/lib/api/seller-catalog';
import { formatDate } from '@/lib/utils';
import { Star } from 'lucide-react';

const LIMIT = 10;

function Stars({ rating }: { rating: number }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          className={n <= rating ? 'star-filled' : 'star-empty'}
          fill={n <= rating ? 'var(--sandy-brown)' : 'var(--cultured)'}
          stroke={n <= rating ? 'var(--sandy-brown)' : 'var(--cultured)'}
        />
      ))}
    </div>
  );
}

export default function ReviewsView() {
  const [page, setPage] = useState(1);

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ['review-summary'],
    queryFn: () => getReviewSummary(),
    staleTime: 60_000,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['reviews', page],
    queryFn: () => getReviews({ page, limit: LIMIT }),
    staleTime: 30_000,
  });

  const summary = summaryData?.data;
  const result = data?.data;
  const totalPages = result ? Math.ceil(result.total / result.limit) : 1;

  const breakdown = summary?.breakdown ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const totalReviews = summary?.count ?? 0;

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">Reviews</div>
      </div>

      <div className="page-content">
        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {summaryLoading ? (
              <div className="skeleton" style={{ height: 60, width: 120 }} />
            ) : (
              <>
                <div style={{ fontSize: 'var(--fs-1)', fontWeight: 700, color: 'var(--salmon-pink)' }}>
                  {(summary?.average ?? 0).toFixed(1)}
                </div>
                <Stars rating={Math.round(summary?.average ?? 0)} />
                <div style={{ fontSize: 'var(--fs-9)', color: 'var(--sonic-silver)' }}>
                  {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                </div>
              </>
            )}
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 'var(--fs-8)', fontWeight: 600, color: 'var(--eerie-black)', marginBottom: 16 }}>
              Rating Breakdown
            </div>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = breakdown[star as 1 | 2 | 3 | 4 | 5] ?? 0;
              const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={star} className="rating-bar-row">
                  <span style={{ fontSize: 'var(--fs-9)', color: 'var(--sonic-silver)', width: 30, display: 'flex', alignItems: 'center', gap: 2 }}>
                    {star} <Star size={10} fill="var(--sandy-brown)" stroke="var(--sandy-brown)" />
                  </span>
                  <div className="rating-bar-track">
                    <div className="rating-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span style={{ fontSize: 'var(--fs-9)', color: 'var(--sonic-silver)', width: 30, textAlign: 'right' }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews list */}
        <div className="card">
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--cultured)',
            fontSize: 'var(--fs-7)',
            fontWeight: 600,
            color: 'var(--eerie-black)',
          }}>
            All Reviews
          </div>

          {isError && (
            <div style={{ padding: 20 }}>
              <div className="error-banner">Failed to load reviews. Please refresh.</div>
            </div>
          )}

          {isLoading ? (
            <div style={{ padding: 20 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 80, marginBottom: 12 }} />
              ))}
            </div>
          ) : !result || result.reviews.length === 0 ? (
            <div className="empty-state">
              <Star size={48} style={{ color: 'var(--cultured)' }} />
              <div className="empty-title">No reviews yet</div>
              <div className="empty-desc">Reviews from customers will appear here once they rate your products.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {result.reviews.map((review) => (
                <div
                  key={review.id}
                  style={{ padding: '16px 20px', borderBottom: '1px solid var(--cultured)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="seller-avatar" style={{ width: 32, height: 32, fontSize: 'var(--fs-9)' }}>
                          {review.reviewerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--eerie-black)', fontSize: 'var(--fs-7)' }}>
                            {review.reviewerName}
                          </div>
                          {review.productName && (
                            <div style={{ fontSize: 'var(--fs-9)', color: 'var(--sonic-silver)' }}>
                              on {review.productName}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <Stars rating={review.rating} />
                      <span style={{ fontSize: 'var(--fs-10)', color: 'var(--spanish-gray)' }}>
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p style={{ color: 'var(--davys-gray)', fontSize: 'var(--fs-7)', lineHeight: 1.5, paddingLeft: 42 }}>
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {result && result.total > LIMIT && (
          <div className="pagination">
            <button className="page-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .map((p, idx, arr) => (
                <React.Fragment key={p}>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span style={{ color: 'var(--spanish-gray)', padding: '0 4px' }}>…</span>
                  )}
                  <button
                    className={`page-btn ${p === page ? 'active' : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                </React.Fragment>
              ))}
            <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>›</button>
          </div>
        )}
      </div>
    </div>
  );
}
