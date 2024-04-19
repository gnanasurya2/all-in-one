########################################################################################################################
# server build stage
########################################################################################################################
ARG RUST_VERSION=1.75.0

FROM rust:${RUST_VERSION}-alpine AS build

RUN apk add libc-dev openssl-dev openssl-libs-static
RUN rustup target add x86_64-unknown-linux-musl

COPY ./src ./src
COPY ./Cargo.lock .
COPY ./Cargo.toml .

RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid 10001 \
    "server"

ENV SQLX_OFFLINE true

RUN cargo build --target x86_64-unknown-linux-musl --release

########################################################################################################################
# server image
########################################################################################################################

FROM alpine:latest

RUN apk --no-cache add ca-certificates

COPY --from=build /etc/passwd /etc/passwd
COPY --from=build /etc/group /etc/group

COPY --from=build --chown=server:server ./target/x86_64-unknown-linux-musl/release/server /app/server

USER server:server

ENTRYPOINT ["./app/server"]