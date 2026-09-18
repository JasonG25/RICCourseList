package main

import (
	"context"
	"testing"

	"github.com/jackc/pgx/v5"
)

func TestDatabaseConnection(t *testing.T) {
	conn, err := pgx.Connect(
		context.Background(),
		"postgres://postgres:Gg252525@localhost:5432/ric_test",
	)
	if err != nil {
		t.Fatal(err)
	}
	defer conn.Close(context.Background())

	rows, err := conn.Query(
		context.Background(),
		"SELECT * FROM students",
	)
	if err != nil {
		t.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var name string

		err := rows.Scan(&id, &name)
		if err != nil {
			t.Fatal(err)
		}

		t.Log(id, name)
	}
}
