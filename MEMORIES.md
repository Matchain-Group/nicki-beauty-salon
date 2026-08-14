# MEMORIES.md

Tracked bugs with open or rejected PRs. One line per entry: location/root cause | PR | status | date.

- Order pipeline: paid orders never persisted as 'paid' (webhook/verify wrote non-existent `paymentStatus`/`paidAt` fields; schema only has `status`), webhook signature check skippable without header, and cart checkout never created an Order | branch `fix/order-payment-status` -> https://github.com/Matchain-Group/nicki-beauty-salon/pull/new/fix/order-payment-status | open (pushed, awaiting PR/review) | 2026-08-14
- Duplicate images: 8 portfolio/testimonial image files were byte-identical copies of other files; home-page Special Offers reused service images; footer logo file missing | branch `fix/duplicate-images` -> https://github.com/Matchain-Group/nicki-beauty-salon/pull/new/fix/duplicate-images | open (pushed, awaiting PR/review) | 2026-08-14