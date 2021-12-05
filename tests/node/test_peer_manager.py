# MIT License
#
# Copyright (c) 2020 Jonathan Zernik
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
import pytest
from sqlalchemy import create_engine

from squeaknode.core.squeak_peer import SqueakPeer
from squeaknode.db.squeak_db import SqueakDb
from squeaknode.node.saved_peer_manager import SavedPeerManager
from squeaknode.node.saved_peer_manager import SEED_PEERS


@pytest.fixture
def db_engine():
    yield create_engine('sqlite://')


@pytest.fixture
def squeak_db(db_engine):
    db = SqueakDb(db_engine)
    db.init()
    yield db


@pytest.fixture()
def saved_peer_manager(squeak_db):
    # TODO: Use a mock db.
    yield SavedPeerManager(squeak_db)


@pytest.fixture()
def seed_peer_dict():
    # TODO: Use a mock db.
    yield SEED_PEERS


@pytest.fixture()
def default_seed_peers(seed_peer_dict):
    # TODO: Use a mock db.
    yield [
        SqueakPeer(
            peer_id=None,
            peer_name="squeakhub",
            address=seed_peer_dict["squeakhub"],
            autoconnect=True,
            share_for_free=False,
        )
    ]


@pytest.fixture()
def saved_peer_name():
    yield "fake_peer_name"


@pytest.fixture()
def inserted_saved_peer(saved_peer_manager, saved_peer_name, peer_address):
    yield saved_peer_manager.create_saved_peer(
        saved_peer_name,
        peer_address,
    )


def test_get_saved_peers(saved_peer_manager, inserted_saved_peer, saved_peer_name):
    peers = saved_peer_manager.get_saved_peers()

    assert len(peers) == 1
    assert peers[0].peer_name == saved_peer_name


def test_get_saved_peer(saved_peer_manager, inserted_saved_peer, saved_peer_name):
    peer = saved_peer_manager.get_saved_peer(inserted_saved_peer)

    assert peer is not None
    assert peer.peer_name == saved_peer_name


def test_get_saved_peer_by_address(saved_peer_manager, inserted_saved_peer, peer_address, saved_peer_name):
    peer = saved_peer_manager.get_saved_peer_by_address(peer_address)

    assert peer is not None
    assert peer.peer_name == saved_peer_name


def test_get_seed_peers(saved_peer_manager, default_seed_peers):
    peers = saved_peer_manager.get_seed_peers()

    assert peers == default_seed_peers


def test_get_seed_peer(saved_peer_manager, default_seed_peers):
    peer = saved_peer_manager.get_seed_peer('squeakhub')

    assert peer == default_seed_peers[0]
    assert peer.peer_id is None


def test_get_seed_peer_none(saved_peer_manager):
    peer = saved_peer_manager.get_seed_peer('fake_seed_peer_name')

    assert peer is None


def test_rename_saved_peer(saved_peer_manager, inserted_saved_peer):
    peer = saved_peer_manager.rename_peer(inserted_saved_peer, 'new_peer_name')
    peer = saved_peer_manager.get_saved_peer(inserted_saved_peer)

    assert peer.peer_name == 'new_peer_name'


def test_delete_saved_peer(saved_peer_manager, inserted_saved_peer):
    peer = saved_peer_manager.delete_peer(inserted_saved_peer)
    peer = saved_peer_manager.get_saved_peer(inserted_saved_peer)

    assert peer is None


def test_set_autoconnect(saved_peer_manager, inserted_saved_peer):
    peer = saved_peer_manager.get_saved_peer(inserted_saved_peer)

    assert peer.autoconnect is False

    peer = saved_peer_manager.set_peer_autoconnect(inserted_saved_peer, False)
    peer = saved_peer_manager.get_saved_peer(inserted_saved_peer)

    assert peer.autoconnect is False

    peer = saved_peer_manager.set_peer_autoconnect(inserted_saved_peer, True)
    peer = saved_peer_manager.get_saved_peer(inserted_saved_peer)

    assert peer.autoconnect is True


def test_set_autoconnect_by_name(saved_peer_manager):
    peer = saved_peer_manager.get_seed_peer('squeakhub')

    assert peer.autoconnect is True

    peer = saved_peer_manager.set_peer_autoconnect_by_name('squeakhub', False)
    peer = saved_peer_manager.get_seed_peer('squeakhub')

    assert peer.autoconnect is False

    peer = saved_peer_manager.set_peer_autoconnect_by_name('squeakhub', True)
    peer = saved_peer_manager.get_seed_peer('squeakhub')

    assert peer.autoconnect is True


def test_set_share_for_free(saved_peer_manager, inserted_saved_peer):
    peer = saved_peer_manager.get_saved_peer(inserted_saved_peer)

    assert peer.share_for_free is False

    peer = saved_peer_manager.set_peer_share_for_free(
        inserted_saved_peer, False)
    peer = saved_peer_manager.get_saved_peer(inserted_saved_peer)

    assert peer.share_for_free is False

    peer = saved_peer_manager.set_peer_share_for_free(
        inserted_saved_peer, True)
    peer = saved_peer_manager.get_saved_peer(inserted_saved_peer)

    assert peer.share_for_free is True


def test_set_share_for_free_by_name(saved_peer_manager):
    peer = saved_peer_manager.get_seed_peer('squeakhub')

    assert peer.share_for_free is False

    peer = saved_peer_manager.set_peer_share_for_free_by_name(
        'squeakhub', False)
    peer = saved_peer_manager.get_seed_peer('squeakhub')

    assert peer.share_for_free is False

    peer = saved_peer_manager.set_peer_share_for_free_by_name(
        'squeakhub', True)
    peer = saved_peer_manager.get_seed_peer('squeakhub')

    assert peer.share_for_free is True


def test_get_autoconnect_peers(saved_peer_manager, default_seed_peers):
    peers = saved_peer_manager.get_autoconnect_peers()

    assert peers == default_seed_peers
